import { useContext, useState } from 'react';
import { 
  DataContext, DATA_SET_IMAGES, DATA_SET_MASKS,
  ErrorContext, ERROR_SET_MESSAGE
} from 'contexts';
import { DragTarget, LoadingIndicator } from 'components/drag-wrapper';
import { getEmbeddings, loadTiff } from 'utils/imageUtils';

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

    if (!evt.currentTarget.contains(evt.relatedTarget)) {
      setDragging(false);
    }
  };

  const onDrop = async (evt, type) => {
    evt.preventDefault();

    const file = evt.dataTransfer.files[0];

    if (file.type === 'image/tiff') {
      setFileName(file.name);

      if (type === 'mask') {
        const masks = await loadTiff(file, true);

        dataDispatch({ 
          type: DATA_SET_MASKS, 
          maskName: file.name, 
          masks: masks
        });
      }
      else {
        const images = await loadTiff(file);
        const embeddings = await getEmbeddings(images);

        dataDispatch({ 
          type: DATA_SET_IMAGES, 
          imageName: file.name, 
          images: images, 
          embeddings: embeddings 
        });
      }
    }
    else {
      errorDispatch({ 
        type: ERROR_SET_MESSAGE, 
        heading: `Wrong file type: ${ file.type ? file.type : 'unknown' }`,
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
            zIndex: 1,
            pointerEvents: 'none'
          }}
        >
          { fileName ?
            <LoadingIndicator fileName={ fileName } />
          :
            <>
              <DragTarget 
                type='image' 
                onDrop={ onDrop } 
              />          
              { !show && 
                <DragTarget 
                  type='mask'
                  onDrop={ onDrop } 
                /> 
              }
            </>
          }
        </div>
      }
    </div>
  );
};