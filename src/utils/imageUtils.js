import npyjs from 'npyjs';
import { clamp } from 'utils/array';
import { getLabelColor } from 'utils/colors';
import { rescale } from 'utils/math';
import { decodeTiff, encodeTiff } from 'utils/tiffUtils';
const ort = require('onnxruntime-web');

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

  return new ImageData(array, height, width);
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

      if (mask[index] === 0) continue;

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

// Test data 
const addNames = imageInfo => {
  const imageNames = [];
  const embeddingNames = [];

  const numDigits = String(imageInfo.numImages).length;

  for (let i = 0; i < imageInfo.numImages; i++)  {
    const n = String(i + 1).padStart(Math.max(2, numDigits), '0');
    const s = `${ imageInfo.baseName }${ n }`;

    imageNames.push(s + '.png');
    embeddingNames.push(s + '.npy');
  }

  return {
    ...imageInfo,
    imageNames,
    embeddingNames
  };
} 

const imageInfo1 = addNames({
  baseName: `${ process.env.PUBLIC_URL }/data/images/test_image/test_image_`,
  numImages: 8,
  imageSize: 48
});

const imageInfo2 = addNames({
  baseName: `${ process.env.PUBLIC_URL }/data/images/purple_box/FKP4_L57D855P1_topro_purplebox_x200y1400z0530_`,
  numImages: 8,
  imageSize: 128
});  

// Decode a Numpy file into a tensor. 
const loadNpyTensor = async (tensorFile, dType) => {
  let npLoader = new npyjs();
  const npArray = await npLoader.load(tensorFile);
  const tensor = new ort.Tensor(dType, npArray.data, npArray.shape);

  return tensor;
};

// Get image embedding from service
const getEmbedding = async (image, index) => {
  const imageInfo = image.name.includes(imageInfo1.baseName) ? imageInfo1 : imageInfo2;

  // XXX: Hack for now to simulate loading from service
  const name = imageInfo.embeddingNames[index % imageInfo.numImages];

  const embedding = await loadNpyTensor(name, 'float32');

  return embedding;
};

// Load a Tiff image
export const loadTiff = async file => {
  try {
    const buffer = await loadFileToBuffer(file);
    const { data, width, height } = decodeTiff(buffer);

    const images = data.map(slice => imageDataToImage(intensityToImageData(slice, width, height)));
    const embeddings = await Promise.all(images.map((image, i) => getEmbedding(image, i)));

    return { images, embeddings };
  }
  catch (err) {
    console.log(err);
    
    return null;
  } 
};

// Save a TIFF image
export const saveTIFF = async (masks, width, height, fileName) => {
  const buffer = encodeTiff(masks, width, height);

  const blob = new Blob([buffer], { type: 'image/tiff' });

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

export const getMaskName = imageName => {
  let i = imageName.lastIndexOf('.');
  
  if (i < 0) i = imageName.length;

  return imageName.slice(0, i - 1) + '_mask' + imageName.slice(i);
};