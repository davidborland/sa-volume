import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './app';
/*
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
*/

/*

import { RenderingEngine } from '@cornerstonejs/core';
import { ViewportType } from '@cornerstonejs/core/dist/esm/enums';
import { ToolGroupManager, Enums, StackScrollMouseWheelTool, ZoomTool } from '@cornerstonejs/tools';
import { registerNiftiImageLoader, loadNiftiImage } from 'loaders';

import * as cornerstone from '@cornerstonejs/core';
import * as tools from '@cornerstonejs/tools';


const url = `${ process.env.PUBLIC_URL }/data/test_image.nii`;

const test = async () => {

const content = document.getElementById('root');
const element = document.createElement('div');
element.id = 'cornerstone-element';
element.style.width = '500px';
element.style.height = '500px';
content.appendChild(element);

      await cornerstone.init();

      tools.init();
      tools.addTool(tools.StackScrollMouseWheelTool);
      tools.addTool(tools.ZoomTool);






      registerNiftiImageLoader();

      const renderingEngineId = 'nifti-engine';
      const renderingEngine = new RenderingEngine(renderingEngineId);
  
      const viewportId = 'nifti-viewport';
      const viewportInput = {
        viewportId: viewportId,
        element: element,
        type: ViewportType.STACK
      };

      renderingEngine.setViewports([viewportInput]);
      const viewport = renderingEngine.getStackViewports()[0];

      const imageIds = await loadNiftiImage(`nifti:${ url }#z`);
      viewport.setStack(imageIds);

      

setTimeout(() => {

const toolGroupId = 'niftiToolGroup'; 
        const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
  
        
        toolGroup.addTool(StackScrollMouseWheelTool.toolName);
        toolGroup.addTool(ZoomTool.toolName);

        toolGroup.addViewport(viewportId, renderingEngineId);

        console.log(cornerstone.getRenderingEngine(renderingEngineId));

        cornerstone.getRenderingEngine(renderingEngineId).renderViewport(viewportId);
        console.log(toolGroup);

        toolGroup.viewportsInfo.forEach(({ renderingEngineId, viewportId }) => {
          cornerstone.getRenderingEngine(renderingEngineId).renderViewport(viewportId);
        });

        // /toolGroup.setToolActive(StackScrollMouseWheelTool.toolName);

        //toolGroup.setToolActive(ZoomTool.toolName, { bindings: [{ mouseButton: Enums.MouseBindings.Primary }]});
    }, 5000);
    };
    
    test();

    */

import { init, RenderingEngine, Types, Enums } from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
import { registerNiftiImageLoader, loadNiftiImage } from 'loaders';

const url = `${ process.env.PUBLIC_URL }/data/test_image.nii`;

// This is for debugging purposes
console.warn(
  'Click on index.ts to open source code for this example --------->'
);

const {
  LengthTool,
  WindowLevelTool,
  StackScrollMouseWheelTool,
  ToolGroupManager,
  Enums: csToolsEnums,
} = cornerstoneTools;

const { ViewportType } = Enums;
const { MouseBindings } = csToolsEnums;

// ======== Set up page ======== //


const size = '500px';
const content = document.getElementById('root');
const viewportGrid = document.createElement('div');

viewportGrid.style.display = 'flex';
viewportGrid.style.display = 'flex';
viewportGrid.style.flexDirection = 'row';

const element1 = document.createElement('div');
const element2 = document.createElement('div');
const element3 = document.createElement('div');
element1.style.width = size;
element1.style.height = size;
element2.style.width = size;
element2.style.height = size;
element3.style.width = size;
element3.style.height = size;

viewportGrid.appendChild(element1);
viewportGrid.appendChild(element2);
viewportGrid.appendChild(element3);

content.appendChild(viewportGrid);

const instructions = document.createElement('p');
instructions.innerText = `
  In this example we have two tool groups.

  The left viewport has a toolgroup with Window/Level bound to left click.
  The middle and right viewports have a toolgroup with the Length totol bound to left click.
  `;

content.append(instructions);
// ============================= //

/**
 * Runs the demo
 */
async function run() {
  // Init Cornerstone and related libraries
  await init();
  await cornerstoneTools.init();

  const toolGroupId1 = 'STACK_TOOL_GROUP_ID_1';
  const toolGroupId2 = 'STACK_TOOL_GROUP_ID_2';

  // Add tools to Cornerstone3D
  cornerstoneTools.addTool(WindowLevelTool);
  cornerstoneTools.addTool(LengthTool);
  cornerstoneTools.addTool(StackScrollMouseWheelTool);

  // Define tool group 1, used by viewport 1
  const toolGroup1 = ToolGroupManager.createToolGroup(toolGroupId1);

  // Add tools to the tool group
  toolGroup1.addTool(WindowLevelTool.toolName);
  toolGroup1.addTool(StackScrollMouseWheelTool.toolName);

  // Set the initial state of the tools
  toolGroup1.setToolActive(WindowLevelTool.toolName, {
    bindings: [
      {
        mouseButton: MouseBindings.Primary, // Left Click
      },
    ],
  });
  toolGroup1.setToolActive(StackScrollMouseWheelTool.toolName);

  // Define tool group 2, used by viewport 2
  const toolGroup2 = ToolGroupManager.createToolGroup(toolGroupId2);

  // Add tools to the tool group
  toolGroup2.addTool(LengthTool.toolName);
  toolGroup2.addTool(StackScrollMouseWheelTool.toolName);

  // Set the initial state of the tools
  toolGroup2.setToolActive(LengthTool.toolName, {
    bindings: [
      {
        mouseButton: MouseBindings.Primary, // Left Click
      },
    ],
  });
  toolGroup2.setToolActive(StackScrollMouseWheelTool.toolName);
/*
  const wadoRsRoot = 'https://d3t6nz73ql33tx.cloudfront.net/dicomweb';
  const StudyInstanceUID =
    '1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463';

  // Get Cornerstone imageIds and fetch metadata into RAM
  const ctImageIds = await createImageIdsAndCacheMetaData({
    StudyInstanceUID,
    SeriesInstanceUID:
      '1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561',
    wadoRsRoot,
  });

  const ptImageIds = await createImageIdsAndCacheMetaData({
    StudyInstanceUID,
    SeriesInstanceUID:
      '1.3.6.1.4.1.14519.5.2.1.7009.2403.879445243400782656317561081015',
    wadoRsRoot,
  });
*/
  registerNiftiImageLoader();
  const imageIds = await loadNiftiImage(`nifti:${ url }#z`);

  // Instantiate a rendering engine
  const renderingEngineId = 'myRenderingEngine';
  const renderingEngine = new RenderingEngine(renderingEngineId);

  const viewportIds = [
    'CT_AXIAL_STACK_1',
    'CT_AXIAL_STACK_2',
    'PT_AXIAL_STACK',
  ];

  // Create a stack viewport
  const viewportInputArray = [
    {
      viewportId: viewportIds[0],
      type: ViewportType.STACK,
      element: element1,
      defaultOptions: {
        background: [0.2, 0, 0.2],
      },
    },
    {
      viewportId: viewportIds[1],
      type: ViewportType.STACK,
      element: element2,
      defaultOptions: {
        background: [0.2, 0, 0.2],
      },
    },
    {
      viewportId: viewportIds[2],
      type: ViewportType.STACK,
      element: element3,
      defaultOptions: {
        background: [0.2, 0, 0.2],
      },
    },
  ];

  renderingEngine.setViewports(viewportInputArray);

  // Get the stack viewport that was created
  const viewport1 = (
    renderingEngine.getViewport(viewportIds[0])
  );
  const viewport2 = (
    renderingEngine.getViewport(viewportIds[1])
  );
  const viewport3 = (
    renderingEngine.getViewport(viewportIds[2])
  );

  // Define a stack containing a single image
  const ctStack = imageIds;
  const ptStack = imageIds;

  // Set the stack on the viewports
  viewport1.setStack(ctStack);
  viewport2.setStack(ctStack);
  viewport3.setStack(ptStack);

  // Set viewport 1 to toolgroup 1
  toolGroup1.addViewport(viewportIds[0], renderingEngineId);
  // Set viewport 2 and 3 to toolgroup 2
  toolGroup2.addViewport(viewportIds[1], renderingEngineId);
  toolGroup2.addViewport(viewportIds[2], renderingEngineId);

  // Render the image
  renderingEngine.renderViewports(viewportIds);
  
  // Set viewport 1 to toolgroup 1
  toolGroup1.addViewport(viewportIds[0], renderingEngineId);
  // Set viewport 2 and 3 to toolgroup 2
  toolGroup2.addViewport(viewportIds[1], renderingEngineId);
  toolGroup2.addViewport(viewportIds[2], renderingEngineId);
}

run();

