import { useRef, useEffect } from 'react';
import * as cornerstone from '@cornerstonejs/core';
import * as cornerstoneNiftiImageLoader from '@cornerstonejs/nifti-image-loader';
import * as cornerstoneWebImageLoader from 'cornerstone-web-image-loader';
import { ViewportType } from '@cornerstonejs/core/dist/esm/enums';
import { registerWebImageLoader, webMetaDataProvider } from 'loaders';

const { init, registerImageLoader, imageLoader, metaData, RenderingEngine } = cornerstone;

registerWebImageLoader(imageLoader);
metaData.addProvider((type, imageId) => webMetaDataProvider(type, imageId, imageIds), 10000);

const url = `nifti:${ process.env.PUBLIC_URL }/data/test_image.nii`;
//const url = 'nifti:https://nifti.nimh.nih.gov/nifti-1/data/avg152T1_LR_nifti.hdr.gz';
//const url = 'web:https://upload.wikimedia.org/wikipedia/commons/d/d5/Behemoth-Leviathan.jpg';

const imageIds = [
  'web:https://cs3d-jpg-example.s3.us-east-2.amazonaws.com/a_vm1460.png',
  'web:https://cs3d-jpg-example.s3.us-east-2.amazonaws.com/a_vm1461.png',
  'web:https://cs3d-jpg-example.s3.us-east-2.amazonaws.com/a_vm1462.png',
  'web:https://cs3d-jpg-example.s3.us-east-2.amazonaws.com/a_vm1463.png',
  'web:https://cs3d-jpg-example.s3.us-east-2.amazonaws.com/a_vm1464.png',
  'web:https://cs3d-jpg-example.s3.us-east-2.amazonaws.com/a_vm1465.png',
  'web:https://cs3d-jpg-example.s3.us-east-2.amazonaws.com/a_vm1466.png',
  'web:https://cs3d-jpg-example.s3.us-east-2.amazonaws.com/a_vm1467.png',
  'web:https://cs3d-jpg-example.s3.us-east-2.amazonaws.com/a_vm1468.png',
  'web:https://cs3d-jpg-example.s3.us-east-2.amazonaws.com/a_vm1469.png',
  'web:https://cs3d-jpg-example.s3.us-east-2.amazonaws.com/a_vm1470.png',
  'web:https://cs3d-jpg-example.s3.us-east-2.amazonaws.com/a_vm1471.png',
  'web:https://cs3d-jpg-example.s3.us-east-2.amazonaws.com/a_vm1472.png',
];

const niftiIds = [
  `${ url }#0`,
  `${ url }#1`
];


// Loads an image given an imageId
function loadImage(imageId) {
  const width = 256;
  const height = 256;
  const numPixels = width * height;
  const pixelData = new Uint16Array(numPixels);
  const rnd = Math.round(Math.random() * 255);
  let index = 0;
  for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
          pixelData[index] = (x + rnd) % 256;
          index++;
      }
  }

  function getPixelData() {
      return pixelData;
  }

  const image = {
      imageId: imageId,
      minPixelValue: 0,
      maxPixelValue: 255,
      slope: 1.0,
      intercept: 0,
      windowCenter: 127,
      windowWidth: 256,
      //render: cornerstone.renderGrayscaleImage,
      getPixelData: getPixelData,
      rows: height,
      columns: width,
      height: height,
      width: width,
      color: false,
      columnPixelSpacing: 1.0,
      rowPixelSpacing: 1.0,
      invert: false,
      sizeInBytes: width * height * 2
  };

  return {
    promise: new Promise((resolve) => resolve(image)),
    cancelFn: undefined
  }
}





export const CornerStoneWrapper = () => {
  const ref =  useRef();

  useEffect(() => {
    const getData = async () => {
      await init();

      //cornerstoneWebImageLoader.external.cornerstone = cornerstone
      
      //cornerstoneNiftiImageLoader.external.cornerstone = cornerstone;
      

      //console.log(cornerstoneNiftiImageLoader)

      //cornerstoneNiftiImageLoader.nifti.loadImage

      //console.log(cornerstoneNiftiImageLoader);

      //registerImageLoader('nifti', cornerstoneNiftiImageLoader);
/*
      const renderingEngineId = 'engine';
      const renderingEngine = new RenderingEngine(renderingEngineId);
  
      const viewportId = 'viewport';
      const viewportInput = {
        viewportId: viewportId,
        element: ref.current,
        type: ViewportType.ORTHOGRAPHIC,
        defaultOptions: {
          orientation: cornerstone.Enums.OrientationAxis.AXIAL
        }
      };

      renderingEngine.setViewports([viewportInput]);
      //renderingEngine.getStackViewports()[0].setStack(imageIds);      
      //renderingEngine.getStackViewports()[0].setStack([url]); 
      //renderingEngine.getStackViewports()[0].setStack(niftiIds);

      const volumeId = 'cornerstoneStreamingImageVolume: myVolume';

      const volume = await cornerstone.volumeLoader.createAndCacheVolume(volumeId, { niftiIds });

      volume.load();

      cornerstone.setVolumesForViewports(renderingEngine, [{ volumeId }], [viewportId]);
*/


cornerstone.registerImageLoader('myImageLoader', loadImage);



      // load the image and display it
      const imageId = 'myImageLoader://1';
      
      
      const renderingEngineId = 'engine';
      const renderingEngine = new RenderingEngine(renderingEngineId);
  
      const viewportId = 'viewport';
      const viewportInput = {
        viewportId: viewportId,
        element: ref.current,
        type: ViewportType.STACK
      };
      renderingEngine.setViewports([viewportInput]);
      renderingEngine.getStackViewports()[0].setStack([imageId]); 
    };

    getData();
  }, []);

  return (
    <div ref={ ref } style={{ width: 500, height: 500 }}>Wrappin'</div>
  );
};
