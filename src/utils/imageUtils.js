import { clamp } from 'utils/array';
import { getLabelColor } from 'utils/colors';
import { rescale } from 'utils/math';
import { decodeTiff, encodeTIFF } from 'utils/tiffUtils';
const ort = require('onnxruntime-web');

const SAM_URL = 'https://sam.apps.renci.org';

// Threshold the mask prediction values
export const thresholdOnnxMask = (input, threshold) => {
  const maxValue = Math.max(...input);
  const minValue = Math.min(...input);
  const extreme = Math.max(maxValue, Math.abs(minValue));
  const t = -extreme + threshold * 2 * extreme;

  return input.map(v => v > t);
}

// Convert the onnx model mask to ImageData
const maskToImageData = (input, width, height, currentLabel) => {
  const array = new Uint8ClampedArray(4 * width * height).fill(0);

  for (let i = 0; i < input.length; i++) {
    const label = input[i];

    if (label > 0) {
      const [r, g, b] = getLabelColor(label);

      array[4 * i + 0] = r;
      array[4 * i + 1] = g;
      array[4 * i + 2] = b;
      array[4 * i + 3] = label === currentLabel ? 255 : 127;
    }
  }

  return new ImageData(array, height, width);
};

// Convert intensity values to ImageData
const intensityToImageData = (input, width, height) => {
  const array = new Uint8ClampedArray(4 * width * height).fill(0);

  const maxValue = Math.max(...input);
  const minValue = Math.min(...input);

  for (let i = 0; i < input.length; i++) {
    const v = rescale(input[i], minValue, maxValue, 0, 255);

    array[4 * i + 0] = v;
    array[4 * i + 1] = v;
    array[4 * i + 2] = v;
    array[4 * i + 3] = 255;
  }

  return new ImageData(array, width, height);
};

// Use a Canvas element to produce an image from ImageData
const imageDataToImage = imageData => {
  const canvas = imageDataToCanvas(imageData);
  const image = new Image();
  image.src = canvas.toDataURL();
  return image;
};

// Canvas elements can be created from ImageData
const imageDataToCanvas = imageData => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  ctx?.putImageData(imageData, 0, 0);
  return canvas;
};

// Convert the onnx model mask output to an HTMLImageElement
export const maskToImage = (input, width, height, currentLabel) => imageDataToImage(maskToImageData(input, width, height, currentLabel));

// Scale image data
export const scaleImageData = (imageData, width, height, scale) => {
  const newWidth = width * scale;
  const newHeight = height * scale;

  const scaledImageData = [];

  for (let y = 0; y < newHeight; y++) {
    for (let x = 0; x < newWidth; x++) {
      const sourceIndex = Math.floor(y / scale) * width + Math.floor(x / scale);
      const targetIndex = y * newWidth + x;

      scaledImageData[targetIndex] = imageData[sourceIndex];
    }
  }

  return scaledImageData;
};

// Apply a label to a binary mask array
export const applyLabel = (mask, label) => mask.map(v => v > 0 ? label : 0);

// Combine two mask image arrays, optionally over-writing
export const combineMasks = (m1, m2, overWrite = false) =>
  m1 && m2 ? m1.map((v1, i) => {
    const v2 = m2[i];
    return overWrite ? (v2 ? v2 : v1) : (v1 ? v1 : v2);
  }) :
  m1 ? [...m1] :
  m2 ? [...m2] :
  null;

// Get the label at a given point
export const getLabel = (mask, x, y, imageWidth) => mask ? mask[y * imageWidth + x] : 0;

// Delete a label 
export const deleteLabel = (mask, label) => 
  mask?.forEach((value, i, mask) => { 
    if (value === label) mask[i] = 0;
  });

// Extract border pixels
export const borderPixels = (mask, imageWidth, imageHeight) => {
  const border = [...mask];

  // XXX: Basically computing a convolution here. Can probably make this faster.
  const offsets = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1]
  ];

  for (let i = 0; i < imageWidth; i++) {
    for (let j = 0; j < imageHeight; j++) {      
      const index = i * imageWidth + j;
      const label = mask[index];

      if (label === 0) continue;

      let isBorder = false;

      for (let k = 0; k < offsets.length; k++) {
        const offset = offsets[k];
        const x = clamp(j + offset[1], 0, imageWidth - 1);
        const y = clamp(i + offset[0], 0, imageHeight - 1);

        if (mask[y * imageWidth + x] !== label) {
          isBorder = true;
          break;
        }
      }

      if (!isBorder) border[index] = 0;
    }
  }

  return border;
};

export const borderPoints = (mask, imageWidth, imageHeight) => {
  const points = [];

  const offsets = [
    { dx: -1, dy:  0},
    { dx:  1, dy:  0},
    { dx:  0, dy: -1},
    { dx:  0, dy:  1 }
  ];

  const radius = 0.5;

  for (let i = 0; i < imageHeight; i++) {
    for (let j = 0; j < imageWidth; j++) {      
      const index = i * imageWidth + j;
      const label = mask[index];

      if (label === 0) continue;

      offsets.forEach(({ dx, dy }) => {
        const x = clamp(j + dx, 0, imageWidth - 1);
        const y = clamp(i + dy, 0, imageHeight - 1);

        if (mask[y * imageWidth + x] !== label) {
          const px = j + radius + dx * radius;
          const py = i + radius + dy * radius;

          let p1x, p1y, p2x, p2y;

          if (dx === 0) {
            p1x = px - radius;
            p1y = py;
            p2x = px + radius;
            p2y = py;
          }
          else {
            p1x = px;
            p1y = py - radius;
            p2x = px;
            p2y = py + radius;
          }

          points.push({ p1: { x: p1x, y: p1y }, p2: { x: p2x, y: p2y }, label });
        }
      });
    }
  }

  return points;
};

// Load a file to a buffer
const loadFileToBuffer = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = evt => {
      const buffer = evt.target.result;
      resolve(buffer);
    };
    
    reader.onerror = evt => {
      reject(evt.target.error);
    };

    reader.readAsArrayBuffer(file);
  });

// Load a TIFF image
export const loadTIFF = async file => {
  try {
    const buffer = await loadFileToBuffer(file);
    const { data, width, height } = decodeTiff(buffer);

    return data.map(slice => imageDataToImage(intensityToImageData(slice, width, height)));
  }
  catch (err) {
    console.log(err);
    
    return null;
  } 
};

// Load a TIFF image as a mask
export const loadTIFFMask = async file => {
  try {
    const buffer = await loadFileToBuffer(file);
    const { data, width, height } = decodeTiff(buffer);

    return { masks: data.map(slice => slice.flat()), width, height }; 
  }
  catch (err) {
    console.log(err);
    
    return null;
  } 
};

// Get image embedding from service
export const getEmbedding = async image => {
  try {
    // XXX: Is there a more efficient way of getting the data in this format?
    const data = image.src.split(',')[1];
    const blobData = atob(data);
    const arrayBuffer = new Uint8Array(blobData.length);
    for (let i = 0; i < blobData.length; i++) {
        arrayBuffer[i] = blobData.charCodeAt(i);
    }

    const blob = new Blob([arrayBuffer], { type: 'image/png' }); // Change the MIME type as needed

    const formData = new FormData();
    formData.append('image', blob);

    const response = await fetch(`${ SAM_URL }/image_slice_embedding`, { 
      method: 'post',
      body: formData 
    });

    const dtype = response.headers.get('x-numpy-dtype');
    const shape = JSON.parse(response.headers.get('x-numpy-shape'));
    const buffer = await response.arrayBuffer(); 

    const tensor = new ort.Tensor(dtype, new Float32Array(buffer), shape);

    return tensor;
  }
  catch (err) {
    console.log(err);

    return null;
  }
};

// Get embeddings for an image stack
export const getEmbeddings = async images => {
  const embeddings = await Promise.all(images.map((image, i) => getEmbedding(image)));

  return embeddings;
};

const saveBlob = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = fileName;

  document.body.appendChild(a);
  a.click();
  
  window.URL.revokeObjectURL(url); 
  a.remove();
};

// Save a TIFF image
export const saveTIFF = (masks, width, height, fileName) => {
  const buffer = encodeTIFF(masks, width, height);

  const blob = new Blob([buffer], { type: 'image/tiff' });
  
  saveBlob(blob, fileName);
};

// Save embeddings as binary blob
export const saveEmbeddings = (embeddings, fileName) => {
  if (embeddings?.length === 0) return;

  const data = embeddings.map(tensor => tensor.data);

  const blob = new Blob(data, { type: 'octet/stream' });

  saveBlob(blob, fileName);

/*
  // Can't just stringify the full JSON object as it might be too large

  let json = `{ "shape":${ embeddings.dims },"dtype":${ embeddings[0].type },"data":[`;
  
  embeddings.forEach(({ data }, i, a) => {
    json += JSON.stringify(Array.from(data));
    if (i < a.length - 1) json += ',';

    console.log(json.length)
  });

  json += ']}';

  console.log(json);

  const blob = new Blob([JSON.stringify(json)], { type: 'application/json' });
  
  saveBlob(blob, fileName);
*/  
};

// Get name for saving mask
export const getMaskName = imageName => {
  let i = imageName.lastIndexOf('.');
  
  if (i < 0) i = imageName.length;

  return imageName.slice(0, i) + '_mask' + imageName.slice(i);
};

// Get name for saving embedding
export const getEmbeddingsName = imageName => {
  let i = imageName.lastIndexOf('.');
  
  if (i < 0) i = imageName.length;

  return imageName.slice(0, i) + '_embedding.blob';
};