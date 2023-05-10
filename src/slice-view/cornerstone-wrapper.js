import { useRef, useEffect } from 'react';
import * as cornerstone from '@cornerstonejs/core';
import * as cornerstoneNiftiImageLoader from '@cornerstonejs/nifti-image-loader';
import { ViewportType } from '@cornerstonejs/core/dist/esm/enums';

const { init, registerImageLoader, imageLoader, RenderingEngine } = cornerstone;

const url = `nifti:${ process.env.PUBLIC_URL }/data/test_image.nii`;

export const CornerStoneWrapper = () => {
  const ref =  useRef();

  useEffect(() => {
    const getData = async () => {
      await init(); 

      cornerstoneNiftiImageLoader.external.cornerstone = cornerstone;
      const ImageId = cornerstoneNiftiImageLoader.nifti.ImageId;
      const imageIdObject = ImageId.fromURL(url);

      imageLoader.loadAndCacheImage(imageIdObject.url).then(function(image) {
        console.log(image);
        
        //console.log(image);
      });

      const image = await cornerstoneNiftiImageLoader.nifti.loadImage(url);

/*
      const renderingEngineId = 'engine';
      const renderingEngine = new RenderingEngine(renderingEngineId);
  
      const viewportId = 'viewport';
      const viewportInput = {
        viewportId: viewportId,
        element: ref.current,
        type: ViewportType.STACK
      };
  
      const viewport = renderingEngine.getViewport(viewportId);
      viewport.setStack(image);
      */
    };

    getData();
  }, []);

  return (
    <div ref={ ref }>Wrappin'</div>
  );
};
