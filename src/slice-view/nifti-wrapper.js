import { useEffect, useState, useRef } from 'react';
import { RenderingEngine } from '@cornerstonejs/core';
import { ViewportType } from '@cornerstonejs/core/dist/esm/enums';
import { ToolGroupManager, StackScrollMouseWheelTool } from '@cornerstonejs/tools';
import { registerNiftiImageLoader, loadNiftiImage } from 'loaders';
import { useOnnx } from 'hooks';

//const clicks = [
  //{ x: 20, y: 20, clickType: 1 },
  //{ x: 15, y: 30, clickType: 1 }
//];

export const NiftiWrapper = ({ url }) => {
  const [viewport, setViewport] = useState();
  const [clicks, setClicks] = useState();
  const { image, maskImage } = useOnnx(
    `${ process.env.PUBLIC_URL }/data/images/test_image_06.png`, // XXX: Hardcoding for now
    clicks
  );
  const div = useRef();
  const toolGroup = useRef();

  // Initialize
  useEffect(() => {
    if (!viewport) {
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
      
      if (!toolGroup.current) {
        const toolGroupId = 'nifti-tool-group';
        toolGroup.current = ToolGroupManager.createToolGroup(toolGroupId);
        
        toolGroup.current.addTool(StackScrollMouseWheelTool.toolName);
        toolGroup.current.addViewport(viewportId, renderingEngineId);

        toolGroup.current.setToolActive(StackScrollMouseWheelTool.toolName);        
      } 
    }
  }, [viewport]);

  // Load image
  useEffect(() => {
    const loadImage = async url => {
      const imageIds = await loadNiftiImage(`nifti:${ url }`);
      viewport.setStack(imageIds);
    }

    if (viewport && url) loadImage(url);
  }, [viewport, url]);

  const onClick = evt => {
    const x = evt.nativeEvent.offsetX;
    const y = evt.nativeEvent.offsetY;
    const click = { x: x / 800 * 48, y: y / 800 * 48, clickType: evt.shiftKey ? 0 : 1 };
    setClicks(clicks ? [...clicks, click] : [click]);
  };

  return (
    <>
      <div ref={ div } style={{ width: '100%', aspectRatio: '1 / 1' }} />
      <div style={{ position: 'relative' }} onClick={ onClick }>
        { image && <img style={{ width: '100%', aspectRatio: '1 / 1', pointerEvents: 'none' }} src={ image.src } alt='original' /> }
        { maskImage && <img style={{ width: '100%', aspectRatio: '1 / 1', position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }} src={ maskImage.src } alt='mask' /> }
      </div>
    </>
  );
};