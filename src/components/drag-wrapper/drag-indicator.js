import { useState, useContext } from 'react';
import { Spinner } from 'react-bootstrap';
import { Upload } from 'react-bootstrap-icons';
import { 
  DataContext, DATA_SET_IMAGES, 
  ErrorContext, ERROR_SET_MESSAGE
} from 'contexts';
import { loadTiff } from 'utils/imageUtils';

export const DragIndicator = ({ type }) => {
  const [, dataDispatch] = useContext(DataContext);
  const [, errorDispatch] = useContext(ErrorContext);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState(null);

  const onDragEnter = evt => {


    console.log("LSDKFJ")

    evt.preventDefault();

    setDragging(true);
  };

  const onDragOver = evt => {
    evt.preventDefault();

    console.log("LSDKJF");
    setDragging(true);
    
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
      onDragEnter={ onDragEnter }
      onDragOver={ onDragOver }
      onDragLeave={ onDragLeave }
      onDrop={ onDrop }
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
          <div>Upload { type } file</div>
          <Upload size={ 48 } />
        </>
      }
    </div>
  );
};