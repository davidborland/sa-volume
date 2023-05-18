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

const imageBaseName = `${ process.env.PUBLIC_URL }/data/images/test_image_`;

export const NiftiWrapper = ({ url }) => {
  const [viewport, setViewport] = useState();
  const [clicks, setClicks] = useState();
  const [threshold, setThreshold] = useState(0);
  const [imageName, setImageName] = useState(imageBaseName + '01.png')
  const { image, maskImage } = useOnnx(
    imageName,
    clicks,
    threshold
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
    const x = evt.nativeEvent.offsetX / 800 * 48;
    const y = evt.nativeEvent.offsetY / 800 * 48;

    

    const click = { x: x, y: y, clickType: evt.shiftKey ? 0 : 1 };
    setClicks((evt.altKey || evt.shiftKey)&& clicks ? [...clicks, click] : [click]);
  };

  const onThresholdChange = evt => {
    setThreshold(+evt.target.value);
  };

  const onSliceChange = evt => {
    setClicks();
    setImageName(`${ imageBaseName }0${ +evt.target.value + 1 }.png`);
  };

  return (
    <>
      <div ref={ div } style={{ width: '100%', aspectRatio: '1 / 1' }} />
      <div style={{ position: 'relative' }} onClick={ onClick }>
        { image && 
          <img 
            style={{ 
              width: '100%', 
              aspectRatio: '1 / 1', 
              pointerEvents: 'none' 
            }} 
            src={ image.src } 
            alt='original' 
          /> 
        }
        { maskImage && 
          <img 
            style={{ 
              width: '100%', 
              aspectRatio: '1 / 1', 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              pointerEvents: 'none',
              opacity: 0.5
            }} 
            src={ maskImage.src } 
            alt='mask' 
          /> 
        }
      </div>
      <label>Threshold</label><input type='range' min={ -20 } max={ 20 } defaultValue={ 0 } onMouseUp={ onThresholdChange } />
      <label>Slice</label><input type='range' min={ 0 } max={ 7 } defaultValue={ 0 } onMouseUp={ onSliceChange } />
    </>
  );
};