import React from 'react';
import ReactDOM from 'react-dom/client';
import * as cornerstone from '@cornerstonejs/core';
import * as tools from '@cornerstonejs/tools';
import './index.css';
import { App } from './app';

const initializeCornerstone = async () => {
  await cornerstone.init();

  await tools.init();
  tools.addTool(tools.StackScrollMouseWheelTool);
};

await initializeCornerstone();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);