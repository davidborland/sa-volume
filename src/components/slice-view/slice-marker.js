export const SliceMarker = ({ numImages, slice }) => {
  return (
    <label>
      Slice: { Array(numImages).fill().map((_, i) => (
        <span 
          style={{ 
            fontWeight: 'bold', 
            opacity: i === slice ? 1 : 0.5 
          }}
          >
            |
          </span>
      ))} { slice + 1}
    </label>
  );
};