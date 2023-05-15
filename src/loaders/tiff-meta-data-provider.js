// From https://github.com/cornerstonejs/cornerstone-nifti-image-loader/issues/48

// Hardcoded metadata provider for TIFF images
export function tiffMetaDataProvider(type, imageId) {
  const colonIndex = imageId.indexOf(':');
  const scheme = imageId.substring(0, colonIndex);
  if (scheme !== 'tiff') return;
  if (type === 'generalSeriesModule') {
    return {
      modality: 'Unknown',
    };
  }
}