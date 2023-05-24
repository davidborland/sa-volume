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
  const [r, g, b, a] = [0, 114, 189, 255]; // the masks's blue color
  const [r2, g2, b2, a2] = [189, 114, 0, 255]; // the masks's red color
  const arr = new Uint8ClampedArray(4 * width * height).fill(0);

  for (let i = 0; i < input.length; i++) {
    // Threshold the onnx model mask prediction at 0.0
    // This is equivalent to thresholding the mask using predictor.model.mask_threshold
    // in python

    const v = input[i];
    if (v > 0) {
      arr[4 * i + 0] = v > 1 ? r2 : r;
      arr[4 * i + 1] = v > 1 ? g2 : g;
      arr[4 * i + 2] = v > 1 ? b2 : b;
      arr[4 * i + 3] = v > 1 ? a2 : a;
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
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
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