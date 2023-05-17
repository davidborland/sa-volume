// Based on https://github.com/facebookresearch/segment-anything/blob/main/demo

import { InferenceSession, Tensor } from 'onnxruntime-web';
import { useState, useEffect } from 'react';
import { handleImageScale } from 'utils';
import npyjs from 'npyjs';
const ort = require('onnxruntime-web');

const MODEL_PATH = `data/onnx/sam_onnx_quantized_example.onnx`;

console.log(MODEL_PATH);

export const useOnnx = imagePath => {
  const [model, setModel] = useState(null); // ONNX model
  const [tensor, setTensor] = useState(null); // Image embedding tensor

  // The ONNX model expects the input to be rescaled to 1024. 
  // The modelScale state variable keeps track of the scale values.
  const [modelScale, setModelScale] = useState(null);

  // Initialize the ONNX model, load the image, and load the SAM pre-computed image embedding
  useEffect(() => {
    // Initialize the ONNX model
    const initModel = async () => {
      try {
        if (MODEL_PATH === undefined) return;
        const model = await InferenceSession.create(MODEL_PATH);
        setModel(model);
      } catch (e) {
        console.log(e);
      }
    };
    initModel();

    // XXX: Probably split into two useEffects here

    // Load the image
    const imageUrl = new URL(imagePath, window.location.origin);
    loadImage(imageUrl);

    // Load the Segment Anything pre-computed embedding
    const embeddingPath = imagePath.split('.')[0] + '.npy';
    Promise.resolve(loadNpyTensor(embeddingPath, 'float32')).then(
      (embedding) => setTensor(embedding)
    );
  }, [imagePath]);

  const loadImage = async (url) => {
    try {
      const img = new Image();
      img.src = url.href;
      img.onload = () => {
        const { height, width, samScale } = handleImageScale(img);
        setModelScale({
          height: height,  // original image height
          width: width,  // original image width
          samScale: samScale, // scaling factor for image which has been resized to longest side 1024
        });
        img.width = width; 
        img.height = height; 
//        setImage(img);
      };
    } catch (error) {
      console.log(error);
    }
  };
  
  // Decode a Numpy file into a tensor. 
  const loadNpyTensor = async (tensorFile: string, dType: string) => {
    let npLoader = new npyjs();
    const npArray = await npLoader.load(tensorFile);
    const tensor = new ort.Tensor(dType, npArray.data, npArray.shape);
    return tensor;
  };
};