import { useEffect, useState, useRef } from 'react';
import { RenderingEngine } from '@cornerstonejs/core';
import { ViewportType } from '@cornerstonejs/core/dist/esm/enums';
import { ToolGroupManager, Enums, StackScrollMouseWheelTool, ZoomTool } from '@cornerstonejs/tools';
import { registerNiftiImageLoader, loadNiftiImage } from 'loaders';


import * as cornerstone from '@cornerstonejs/core';
import * as tools from '@cornerstonejs/tools';

export const NiftiWrapper = ({ url }) => {
  const [viewport, setViewport] = useState();
  const div = useRef();
  const toolGroup = useRef();

  // Initialize
  useEffect(() => {
    const toolGroupId = 'niftiToolGroup';
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
        toolGroup.current = ToolGroupManager.createToolGroup(toolGroupId);
  
        
        toolGroup.current.addTool(StackScrollMouseWheelTool.toolName);
        toolGroup.current.addViewport(viewportId, renderingEngineId);

        toolGroup.current.setToolActive(StackScrollMouseWheelTool.toolName);
        
        

        toolGroup.current.addTool(ZoomTool.toolName);
        toolGroup.current.addViewport(viewportId, renderingEngineId);

        toolGroup.current.setToolActive(ZoomTool.toolName, { bindings: [{ mouseButton: Enums.MouseBindings.Primary }]});
        
      } 
    }   

    return () => {
      //ToolGroupManager.destroyToolGroup(toolGroupId);
      //toolGroup.current = null;
    };
  }, [viewport]);

  // Load image
  useEffect(() => {
    const loadImage = async url => {
      const imageIds = await loadNiftiImage(`nifti:${ url }#z`);
      viewport.setStack(imageIds);
    }

    if (viewport && url) loadImage(url);
  }, [viewport, url]);

  return (
    <div ref={ div } style={{ width: 500, height: 500 }} />
  );
};
