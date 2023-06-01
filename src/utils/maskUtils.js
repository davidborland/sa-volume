import { getLabelColor } from 'utils/colors';

// Threshold the mask prediction values
export const thresholdOnnxMask = (input, threshold) => {
  const maxValue = Math.max(...input);
  const minValue = Math.min(...input);
  const extreme = Math.max(maxValue, Math.abs(minValue));
  const t = -extreme + threshold * 2 * extreme;

  return input.map(v => v > t);
}

// Convert the onnx model mask to ImageData
const maskToImageData = (input, width, height) => {
  const arr = new Uint8ClampedArray(4 * width * height).fill(0);

  for (let i = 0; i < input.length; i++) {
    const label = input[i];

    if (label > 0) {
      const [r, g, b] = getLabelColor(label);

      arr[4 * i + 0] = r;
      arr[4 * i + 1] = g;
      arr[4 * i + 2] = b;
      arr[4 * i + 3] = 255;
    }
  }

  return new ImageData(arr, height, width);
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
export const maskToImage = (input, width, height) => imageDataToImage(maskToImageData(input, width, height));

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
export const getLabel = (mask, x, y, imageSize) => mask ? mask[y * imageSize + x] : 0;

// Delete a label 
export const deleteLabel = (mask, label) => 
  mask.forEach((value, i, mask) => { 
    if (value === label) mask[i] = 0;
  });