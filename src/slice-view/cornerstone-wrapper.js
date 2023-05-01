import { useRef, useEffect } from 'react';
import { imageLoader, RenderingEngine }from '@cornerstonejs/core';
import { ViewportType } from '@cornerstonejs/core/dist/esm/enums';

const url = 'data/test_image.nii';

export const CornerStoneWrapper = () => {
  const ref =  useRef();

  useEffect(() => {
    const getData = async () => {
      const image = imageLoader.loadImage(url);

      console.log(image);

      const renderingEngineId = 'engine';
      const renderingEngine = new RenderingEngine(renderingEngineId);
  
      const viewportId = 'viewport';
      const viewportInput = {
        viewportId: viewportId,
        element: ref.current,
        type: ViewportType.STACK
      };
  
      const viewport = renderingEngine.getViewport(viewportId);
      viewport.setStack()
    };

    getData();
  }, []);

  return (
    <div ref={ ref }>Wrappin'</div>
  );
};
