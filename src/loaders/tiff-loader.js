import * as cornerstone from '@cornerstonejs/core';
import { tiffMetaDataProvider } from './tiff-meta-data-provider';

const fromURL = imageId => {
  return {
    filePath: 
  };
};

export function registerTiffImageLoader() {
  imageLoader.registerImageLoader('tiff', _loadImageIntoBuffer);

  // Register an additional metadata provider for Nifti images (for the generalSeriesModule, not provided by the package)
  cornerstone.metaData.addProvider(
    (type, imageId) => tiffMetaDataProvider(type, imageId),
    1000
  );
}

export async function loadTiffImage(imageId) {
  const colonIndex = imageId.indexOf(':');
  const scheme = imageId.substring(0, colonIndex);
  if (scheme !== 'tiff') {
    console.warn('createImageIdsAndCacheMetaData: imageId must have scheme "tiff". imageId: ', imageId);
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