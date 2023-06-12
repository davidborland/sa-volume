import { useContext, useState } from 'react';
import { 
  DataContext, DATA_SET_IMAGES, 
  ErrorContext, ERROR_SET_MESSAGE
} from 'contexts';
import { DragIndicator } from 'components/drag-wrapper';
import { loadTiff } from 'utils/imageUtils';

export const DragWrapper = ({ show, children }) => {
  const [, dataDispatch] = useContext(DataContext);
  const [, errorDispatch] = useContext(ErrorContext);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState(null);

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

  const onDrop = async evt => {
    evt.preventDefault();

    const file = evt.dataTransfer.files[0];

    if (file.type === 'image/tiff') {
      setFileName(file.name);

      const { images, embeddings } = await loadTiff(file);

      dataDispatch({ 
        type: DATA_SET_IMAGES, 
        imageName: file.name, 
        images: images, 
        embeddings: embeddings 
      });
    }
    else {
      errorDispatch({ 
        type: ERROR_SET_MESSAGE, 
        heading: `Wrong file type: ${ file.type }`,
        message: 'Please upload a single multi-page TIFF file (image/tiff)' 
      });
    }

    setDragging(false);
    setFileName(null);
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
      onDrop={ onDrop }
    >
      { children }
      { (show || dragging) && 
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
          <DragIndicator 
            dragging={ dragging}
            fileName={ fileName }
          />
        </div>
      }
    </div>
  );
};