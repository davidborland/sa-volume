// Based on https://github.com/facebookresearch/segment-anything/blob/main/demo

import { InferenceSession } from 'onnxruntime-web';
import { useState, useEffect } from 'react';
import { thresholdOnnxMask } from 'utils/maskUtils';
import { handleImageScale } from 'utils/scaleHelper';
import { modelData } from 'utils/onnxModelAPI'
import npyjs from 'npyjs';
const ort = require('onnxruntime-web');

const MODEL_PATH = `${ process.env.PUBLIC_URL }/data/onnx/sam_onnx_quantized_example.onnx`;
//const MODEL_PATH = `${ process.env.PUBLIC_URL }/data/onnx/sam_onnx_example.onnx`;

export const useSam = (image, embeddingPath, clicks, threshold) => {
  const [model, setModel] = useState(null); // ONNX model
  const [tensor, setTensor] = useState(null); // Image embedding tensor
  const [mask, setMask] = useState(null); // Mask

  // The ONNX model expects the input to be rescaled to 1024. 
  // The modelScale state variable keeps track of the scale values.
  const [modelScale, setModelScale] = useState(null);

  // Initialize the ONNX model
  useEffect(() => {
    // Initialize the ONNX model
    const initModel = async () => {
      try {
        if (MODEL_PATH === undefined) return;
        const model = await InferenceSession.create(MODEL_PATH);
        setModel(model);
      } catch (error) {
        console.log(error);
      }
    };
    initModel();
  }, []);

  // Load the image and the SAM pre-computed image embedding
  useEffect(() => {
    // Load the image
    loadImage(image);

    // Load the Segment Anything pre-computed embedding
    Promise.resolve(loadNpyTensor(embeddingPath, 'float32')).then(
      (embedding) => setTensor(embedding)
    );
  }, [image, embeddingPath]);

  const loadImage = async image => {
    try {
      const { height, width, samScale } = handleImageScale(image);
      setModelScale({
        height: height,  // original image height
        width: width,  // original image width
        samScale: samScale, // scaling factor for image which has been resized to longest side 1024
      });
    } 
    catch (error) {
      console.log(error);
    }
  };

  // Decode a Numpy file into a tensor. 
  const loadNpyTensor = async (tensorFile, dType) => {
    let npLoader = new npyjs();
    const npArray = await npLoader.load(tensorFile);
    const tensor = new ort.Tensor(dType, npArray.data, npArray.shape);
    return tensor;
  };

  // Run the ONNX model every time clicks has changed
  useEffect(() => {
    const runONNX = async () => {
      try {
        if (
          !clicks ||
          model === null ||
          tensor === null ||
          modelScale === null
        ) {          
          setMask(null);
          return;
        }
        else {
          // Prepare the model input in the correct format for SAM. 
          // The modelData function is from onnxModelAPI.tsx.
          const feeds = modelData({
            clicks,
            tensor,
            modelScale,
          });
          
          if (feeds === undefined) {
            setMask(null);
            return;
          };

          // Run the SAM ONNX model with the feeds returned from modelData()
          const results = await model.run(feeds);
          const output = results[model.outputNames[0]];

          // The predicted mask returned from the ONNX model is an array.
          setMask(thresholdOnnxMask(output.data, threshold));
        }
      } catch (error) {
        console.log(error);
      }
    };

    runONNX();
  }, [model, clicks, threshold, tensor, modelScale]);

  return mask;
};