import { useEffect, useState } from 'react';
import * as cornerstone from '@cornerstonejs/core';
import * as tools from '@cornerstonejs/tools';

localStorage.setItem("initialized", "false");

export const useCornerstone = () => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      await cornerstone.init();

      tools.init();
      tools.addTool(tools.StackScrollMouseWheelTool);
      tools.addTool(tools.ZoomTool);

      setInitialized(true);

      localStorage.setItem("initialized", "true");
    };

    console.log(localStorage.getItem("initialized"))

    if (localStorage.getItem("initialized") !== "true") initialize();

    return () => {
      tools.destroy();
    }
  }, [initialized]);

  return initialized;
};