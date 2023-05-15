import { useRef, useEffect } from 'react';
import { init, RenderingEngine } from '@cornerstonejs/core';
import { ViewportType } from '@cornerstonejs/core/dist/esm/enums';
import { registerNiftiImageLoader, loadNiftiImage } from 'loaders';

const url = `${ process.env.PUBLIC_URL }/data/test_image.nii`;

export const NiftiWrapper = () => {
  const ref =  useRef();

  // Probably should be moved to a hook?
  useEffect(() => {
    const getData = async () => {
      await init();

      registerNiftiImageLoader();
      const imageIds = await loadNiftiImage(`nifti:${ url }#z`);

      const renderingEngineId = 'nifti-engine';
      const renderingEngine = new RenderingEngine(renderingEngineId);
  
      const viewportId = 'nifti-viewport';
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
    };

    getData();
  }, []);

  return (
    <div ref={ ref } style={{ width: 500, height: 500 }} />
  );
};
