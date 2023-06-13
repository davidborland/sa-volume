import { Spinner } from 'react-bootstrap';

export const LoadingIndicator = ({ fileName }) => {
  return (
    <div
      style={{ 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div>Loading...</div>
      <Spinner className='my-1' style={{ width: 48, height: 48 }} />
      <div className='small text-muted'>{ fileName }</div>
    </div>
  );
};