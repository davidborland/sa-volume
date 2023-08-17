import { Spinner, ProgressBar } from 'react-bootstrap';

export const LoadingIndicator = ({ fileName, toLoad = null, loaded = null }) => {
  return (
    <div
      style={{ 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5
      }}
    >
      <div>Loading...</div>
      <Spinner className='my-1' style={{ width: 48, height: 48 }} />      
      <div className='small text-muted'>{ fileName }</div>
      { toLoad !== null && 
        <div 
          style={{ 
            position: 'relative',
            width: '100%'
          }}
        >
          <div
            className='small text-muted'
            style={{
              width: '100%',
              textAlign: 'center'
            }}
          >
            SAM embeddings
          </div>
          <ProgressBar 
            max={ toLoad } 
            now={ loaded } 
          />
        </div> 
      }
    </div>
  );
};