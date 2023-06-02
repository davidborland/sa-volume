import { useRef, useEffect } from 'react';
import { imageLoader, metaData, RenderingEngine } from '@cornerstonejs/core';
import { ViewportType } from '@cornerstonejs/core/dist/esm/enums';
import { registerWebImageLoader, webMetaDataProvider } from 'loaders';

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

export const WebWrapper = () => {
  const ref =  useRef();

  useEffect(() => {
    registerWebImageLoader(imageLoader);
    metaData.addProvider((type, imageId) => webMetaDataProvider(type, imageId, imageIds), 10000);

    const renderingEngineId = 'web-engine';
    const renderingEngine = new RenderingEngine(renderingEngineId);

    const viewportId = 'web-viewport';
    const viewportInput = {
      viewportId: viewportId,
      element: ref.current,
      type: ViewportType.STACK
    };

    renderingEngine.setViewports([viewportInput]);
    const viewport = renderingEngine.getStackViewports()[0];
    viewport.setStack(imageIds);

    let z = 0;
    let direction = -1;
    setInterval(() => {      
      viewport.setImageIdIndex(z);

      if (z >= imageIds.length - 1 || z <= 0) direction *= -1; 
      z += direction;
    }, 1000);
  }, []);

  return (
    <div ref={ ref } style={{ width: 500, height: 500 }} />
  );
};
