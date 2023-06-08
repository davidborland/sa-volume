import { useState } from 'react';
import { Upload } from 'react-bootstrap-icons';

export const DragWrapper = ({ children }) => {
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

  const onDrop = evt => {
    evt.preventDefault();

    console.log(evt.dataTransfer.files[0]);

    setDragging(false);
  };

  return (
    <div
      style={{
        position: 'relative'
      }}
      onDragEnter={ onDragEnter }
      onDragOver={ onDragOver }
      onDragLeave={ onDragLeave }
      onDrop={ onDrop }
    >
      { children }
      { dragging && 
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1,
            pointerEvents: 'none'
          }}
        >
          <div
            style={{ 
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              border: '2px dashed #666',
              aspectRatio: '1 / 1',
              borderRadius: '50%',
              padding: 20
            }}
          >
            <div>Upload file</div>
            <Upload size={ 48 } />
          </div>
        </div>
      }
    </div>
  );
};