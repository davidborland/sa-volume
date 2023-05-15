import { useEffect, useState, useRef } from 'react';
import { init, RenderingEngine } from '@cornerstonejs/core';
import { ViewportType } from '@cornerstonejs/core/dist/esm/enums';
import { registerNiftiImageLoader, loadNiftiImage } from 'loaders';

export const NiftiWrapper = ({ url }) => {
  const [viewport, setViewport] = useState();
  const div =  useRef();

  useEffect(() => {
    const initialize = async () => {
      if (!viewport) {
        await init();

        registerNiftiImageLoader();

        const renderingEngineId = 'nifti-engine';
        const renderingEngine = new RenderingEngine(renderingEngineId);
    
        const viewportId = 'nifti-viewport';
        const viewportInput = {
          viewportId: viewportId,
          element: div.current,
          type: ViewportType.STACK
        };

        renderingEngine.setViewports([viewportInput]);
        setViewport(renderingEngine.getStackViewports()[0]);
      }
    };

    initialize();
  }, [viewport]);

  useEffect(() => {
    const loadImage = async url => {
      const imageIds = await loadNiftiImage(`nifti:${ url }`);
      viewport.setStack(imageIds);
    }

    if (viewport && url) loadImage(url);
  }, [viewport, url]);

  return (
    <div ref={ div } style={{ width: 500, height: 500 }} />
  );
};
