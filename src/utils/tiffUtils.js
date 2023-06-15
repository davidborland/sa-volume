import * as tiff from 'tiff';
import utif from 'utif';

// Decode using tiff library
export const decodeTiff = buffer => {
  const ifds = tiff.decode(buffer);

  if (ifds.length === 0) return null;

  const { width, height } = ifds[0];
  const data = ifds.map(({ data }) => [...data]);

  return { data, width, height };
};

// Augment utif tag types with some we need
utif.ttypes[254] = 4;
utif.ttypes[297] = 5;

// Based on encodeImage from utif, but adjusted for multipage single component images with different bits
export const encodeTIFF = (images, w, h, bpp = 16) => {
  const n = images.length;
  const buffer = images.flat();
  const bytes = bpp / 8;
  const stripByteCounts = w * h * bytes;
  const arrayType = bpp === 32 ? Uint32Array : bpp === 16 ? Uint16Array : Uint8Array;
 
  const idf = { 
    t254: [2],                // subfile type
    t256: [w],                // image width
    t257: [h],                // image height
    t258: [bpp],              // bits per sample
    t259: [1],                // compression
    t262: [1],                // photometric interpretation
    t274: [1],                // orientation
    t277: [1],                // samples per pixel
    t278: [h],                // rows per strip
    t279: [stripByteCounts],  // strip byte counts
    t282: [10],               // x resolution
    t283: [10],               // y resolution
    t284: [1],                // planar configuration
    t296: [3]                 // resolution unit
  };


  // XXX: Magic number, should be able to calculate from idf size?
  const headerOffset = 120 * n;
  
  const idfs = [];
  for (let i = 0; i < n; i++) {
    const offset = headerOffset * bytes + i * stripByteCounts;

    idfs.push({
      ...idf,
      t273: [offset],      // strip offsets
      t297: [i, n],        // page number
    });
  }
  
  const prfx = new arrayType(utif.encode(idfs));
  const data = new arrayType(headerOffset + n * stripByteCounts);
  const view = new DataView(data.buffer);
  
	for (let i = 0; i < prfx.length; i++) data[i] = prfx[i];
  for (let i = 0; i < buffer.length; i++) view.setUint16(headerOffset * bytes + i * bytes, buffer[i], false);

	return view.buffer;
}