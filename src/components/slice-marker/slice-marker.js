export const SliceMarker = ({ numImages, slice }) => {
  return (
    <>
      { numImages === 0 ? 
        null
      : numImages === 1 ?
        <div />
      :
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5
          }}
        >
          <label>Slice</label>
          <div style={{ marginTop: -3 }}>
            { Array(numImages).fill().map((_, i) => (
              <span 
                key={ i }
                className='small'
                style={{ 
                  fontWeight: 'bold', 
                  opacity: i === slice ? 1 : 0.25 
                }}
              >|</span>
            ))}
          </div>
          <label>{ slice + 1 } / { numImages }</label>      
        </div>
      }
    </>
  );
};