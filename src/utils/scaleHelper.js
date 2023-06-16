// Helper function for handling image scaling needed for SAM
export const handleImageScale = image => {
  // Input images to SAM must be resized so the longest side is 1024
  const LONG_SIDE_LENGTH = 1024;

  // XXX: TEST SUBVOLUME
  let w = 128;// image.naturalWidth;
  let h = 128;//image.naturalHeight;
  const samScale = LONG_SIDE_LENGTH / Math.max(h, w);
  return { height: h, width: w, samScale };
};