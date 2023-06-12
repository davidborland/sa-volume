import { Spinner } from 'react-bootstrap';
import { Upload } from 'react-bootstrap-icons';

export const DragIndicator = ({ dragging, fileName }) => {
  return (
    <div
      style={{ 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderStyle: 'dashed',              
        borderColor: fileName ? 'rgba(0, 0, 0, 0)' : dragging ? '#fff' : '#666',
        aspectRatio: '1 / 1',
        borderRadius: '50%',
        padding: 20
      }}
    >
      {
        fileName ? 
        <>
          <div>Loading...</div>
          <Spinner className='my-1' style={{ width: 48, height: 48 }} />
          <div className='small text-muted'>{ fileName }</div>
        </>      
      :
        <>
          <div>Upload file</div>
          <Upload size={ 48 } />
        </>
      }
    </div>
  );
};