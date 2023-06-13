import { useState, useContext } from 'react';
import { Spinner } from 'react-bootstrap';
import { Upload } from 'react-bootstrap-icons';
import { 
  DataContext, DATA_SET_IMAGES, DATA_SET_MASKS,
  ErrorContext, ERROR_SET_MESSAGE
} from 'contexts';
import { getEmbeddings, loadTiff } from 'utils/imageUtils';

export const DragIndicator = ({ type, onDrop }) => {
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

    setDragging(true);
  };

  const onDragLeave = evt => {
    evt.preventDefault();

    setDragging(false);
  };

  const handleDrop = async evt => {
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
        heading: `Wrong file type: ${ file.type }`,
        message: 'Please upload a single multi-page TIFF file (image/tiff)' 
      });
    }

    setDragging(false);
    setFileName(null);

    onDrop();
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
        borderColor: fileName ? 'rgba(0, 0, 0, 0)' : dragging ? '#fff' : '#666',
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
        {
          fileName ? 
          <>
            <div>Loading...</div>
            <Spinner className='my-1' style={{ width: 48, height: 48 }} />
            <div className='small text-muted'>{ fileName }</div>
          </>      
        :
          <>
            <div>
              { type === 'mask' ?
                <>Load mask for current image</>
              :
                <>Load new image</>
              }
            </div>
            <Upload className='mt-1' size={ 48 } />
          </>
        }
      </div>
    </div>
  );
};