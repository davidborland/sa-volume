// From https://github.com/cornerstonejs/cornerstone-nifti-image-loader/issues/48

/**
 * Hardcoded metadata provider for NIFTI images, as they don't exist in the old cornerstone module
 */
export function niftiMetaDataProvider(type, imageId) {
  const colonIndex = imageId.indexOf(':');
  const scheme = imageId.substring(0, colonIndex);
  if (scheme !== 'nifti') return;
  if (type === 'generalSeriesModule') {
    return {
      modality: 'Unknown',
    };
  }
}