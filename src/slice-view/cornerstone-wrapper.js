import { useRef, useEffect } from 'react';
import * as cornerstone from '@cornerstonejs/core';
import * as cornerstoneNiftiImageLoader from '@cornerstonejs/nifti-image-loader';
import * as cornerstoneWebImageLoader from 'cornerstone-web-image-loader';
import { ViewportType } from '@cornerstonejs/core/dist/esm/enums';
import { registerTestImageLoader, testMetaDataProvider } from 'utils';



const { init, registerImageLoader, imageLoader, metaData, RenderingEngine } = cornerstone;

registerTestImageLoader(imageLoader);
metaData.addProvider((type, imageId) => testMetaDataProvider(type, imageId, imageIds), 10000);

const url = `nifti:${ process.env.PUBLIC_URL }/data/test_image.nii`;
//const url = 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Behemoth-Leviathan.jpg';

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

export const CornerStoneWrapper = () => {
  const ref =  useRef();

  useEffect(() => {
    const getData = async () => {
      await init();

      //cornerstoneWebImageLoader.external.cornerstone = cornerstone
      
      //cornerstoneNiftiImageLoader.external.cornerstone = cornerstone;

      //console.log(cornerstoneNiftiImageLoader)

      //cornerstoneNiftiImageLoader.nifti.loadImage

      //registerImageLoader('nifti', cornerstoneNiftiImageLoader);

      const renderingEngineId = 'engine';
      const renderingEngine = new RenderingEngine(renderingEngineId);
  
      const viewportId = 'viewport';
      const viewportInput = {
        viewportId: viewportId,
        element: ref.current,
        type: ViewportType.STACK
      };

      renderingEngine.setViewports([viewportInput]);
      renderingEngine.getStackViewports()[0].setStack(imageIds);      
    };

    getData();
  }, []);

  return (
    <div ref={ ref } style={{ width: '512px', height: '512px' }}>Wrappin'</div>
  );
};
