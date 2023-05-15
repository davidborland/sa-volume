// Based on https://github.com/cornerstonejs/cornerstone-nifti-image-loader/issues/48

import * as cornerstone from '@cornerstonejs/core';
import * as cornerstoneNIFTIImageLoader from '@cornerstonejs/nifti-image-loader';
import { niftiMetaDataProvider } from './nifti-meta-data-provider';

export function registerNifti() {
  // Register the nifti image loader
  cornerstoneNIFTIImageLoader.external.cornerstone = cornerstone;

  // NOTE: This is a hack to get around the fact that the nifti image loader
  // uses the old cornerstone module, and we need to provide it with the
  // new cornerstone module (events = eventTarget).
  cornerstoneNIFTIImageLoader.external.cornerstone.events = cornerstone.eventTarget;
  // cornerstoneNIFTIImageLoader.nifti.streamingMode = true;

  // Register an additional metadata provider for Nifti images (for the generalSeriesModule, not provided by the package)
  cornerstone.metaData.addProvider(
    (type, imageId) => niftiMetaDataProvider(type, imageId),
    1000 // Priority of the NIFTI metadata provider is 10000, so this one is called after
  );
}

/**
 * Uses the NIFTI image loader to fetch metadata of a NIFTI, cache it in cornerstone,
 * and return a list of imageIds for the frames.
 */
export async function loadNiftiImage(imageId) {
  const colonIndex = imageId.indexOf(':');
  const scheme = imageId.substring(0, colonIndex);
  if (scheme !== 'nifti') {
    console.warn('createImageIdsAndCacheMetaData: imageId must have scheme "nifti". imageId: ', imageId);
    return;
  }

  // Load the image (it will be stored in the cache, and the metadata also)
  const imageIdObject = cornerstoneNIFTIImageLoader.nifti.ImageId.fromURL(imageId);
  const image = await cornerstone.imageLoader.loadAndCacheImage(imageIdObject.url);

  // Get the number of frames from the metadata the image loader provides
  const numberOfFrames = cornerstone.metaData.get('multiFrame', image.imageId).numberOfFrames;
  const imageIds = Array.from(Array(numberOfFrames),
    (_, i) => `nifti:${imageIdObject.filePath}#${imageIdObject.slice.dimension}-${i},t-0`);

  return imageIds;
}