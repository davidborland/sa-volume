const hexToRGB = v => {
  const r = parseInt(v.slice(1, 3), 16);
  const g = parseInt(v.slice(3, 5), 16);
  const b = parseInt(v.slice(5, 7), 16);
  
  return [r, g, b];
};

// d3 category 10 with grey removed
const labelColorsHex = '1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf'
  .match(/.{1,6}/g).filter((_, i) => i !== 7).map(hex => `#${ hex }`) ?? [];
  
const labelColors = labelColorsHex.map(hexToRGB);

export const getLabelColor = label => labelColors[(label - 1) % labelColors.length];
export const getLabelColorHex = label => labelColorsHex[(label - 1) % labelColorsHex.length];