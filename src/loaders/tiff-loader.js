import * as cornerstone from '@cornerstonejs/core';
import { tiffMetaDataProvider } from './tiff-meta-data-provider';

export function registerTiff() {
  // Register an additional metadata provider for Nifti images (for the generalSeriesModule, not provided by the package)
  cornerstone.metaData.addProvider(
    (type, imageId) => tiffMetaDataProvider(type, imageId),
    1000
  );
}

