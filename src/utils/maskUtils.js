const hexToRGB = v => {
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  
  return [r, g, b];
};

// d3 category 10
const colors = '1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf'
  .match(/.{1,6}/g).filter((_, i) => i !== 7).map(hexToRGB) ?? [];

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
      const [r, g, b] = colors[(label -1) % colors.length];

      arr[4 * i + 0] = r;
      arr[4 * i + 1] = g;
      arr[4 * i + 2] = b;
      arr[4 * i + 3] = 255;
    }
  }

  return new ImageData(arr, height, width);
};

// Use a Canvas element to produce an image from ImageData
function imageDataToImage(imageData) {
  const canvas = imageDataToCanvas(imageData);
  const image = new Image();
  image.src = canvas.toDataURL();
  return image;
}

// Canvas elements can be created from ImageData
function imageDataToCanvas(imageData) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  ctx?.putImageData(imageData, 0, 0);
  return canvas;
}


// Convert the onnx model mask output to an HTMLImageElement
export function maskToImage(input, width, height) {
  return imageDataToImage(maskToImageData(input, width, height));
}

export const applyLabel = (mask, label) => mask.map(v => v > 0 ? label : 0);

export const combineMasks = (m1, m2, overWrite = false) => {
  return m1 && m2 ? m1.map((v1, i) => {
    const v2 = m2[i];
    return overWrite ? (v2 ? v2 : v1) : (v1 ? v1 : v2);
  }) :
  m1 ? m1.map(v => v) :
  m2 ? m2.map(v => v) :
  null;
};