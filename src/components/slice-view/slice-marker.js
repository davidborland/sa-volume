export const SliceMarker = ({ numImages, slice }) => {
  return (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5
      }}
    >
      <label>Slice:</label>
      <div style={{ marginTop: -5 }}>
        { Array(numImages).fill().map((_, i) => (
          <span 
            style={{ 
              fontWeight: 'bold', 
              opacity: i === slice ? 1 : 0.5 
            }}
          >|</span>
        ))}
      </div>
      <label>{ slice + 1 }</label>      
    </div>
  );
};