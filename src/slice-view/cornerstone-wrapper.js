import { useRef, useEffect } from 'react';
import { imageLoader }from '@cornerstonejs/core';

const url = 'url.nii';

export const CornerStoneWrapper = () => {
  const ref =  useRef();

  useEffect(() => {
    console.log(imageLoader);
  }, []);

  return (
    <div ref={ ref }>Wrappin'</div>
  );
};
