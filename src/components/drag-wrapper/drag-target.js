import { useState } from 'react';
import { Upload } from 'react-bootstrap-icons';

export const DragTarget = ({ type, onDrop }) => {
  const [dragging, setDragging] = useState(false);

  const onDragEnter = evt => {
    evt.preventDefault();

    setDragging(true);
  };

  const onDragOver = evt => {
    evt.preventDefault();
  };

  const onDragLeave = evt => {
    evt.preventDefault();

    setDragging(false);
  };

  const handleDrop = evt => {
    setDragging(false);

    onDrop(evt, type);
  };

  const size = 180;

  return (
    <div
      style={{ 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderStyle: 'dashed',              
        borderColor: dragging ? '#fff' : '#666',
        borderRadius: '50%',
        width: size,
        height: size,
        padding: 20,
        textAlign: 'center',
        pointerEvents: 'all'
      }}
      onDragEnter={ onDragEnter }
      onDragOver={ onDragOver }
      onDragLeave={ onDragLeave }
      onDrop={ handleDrop }
    >
      <div style={{ pointerEvents: 'none' }}>
        { type === 'mask' ?
          <>Load mask for current image</>
        :
          <>Load new image</>
        }
        <Upload className='mt-1' size={ 48 } />
      </div>
    </div>
  );
};