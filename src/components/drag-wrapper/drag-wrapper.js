import { useState } from 'react';
import { DragIndicator } from 'components/drag-wrapper';

export const DragWrapper = ({ show, children }) => {
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

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1 / 1',
      }}
      onDragEnter={ onDragEnter }
      onDragOver={ onDragOver }
      onDragLeave={ onDragLeave }
    >
      { children }
      { (show || dragging) && 
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1
          }}
        >
          <DragIndicator type='image' />          
          <DragIndicator type='mask' />
        </div>
      }
    </div>
  );
};