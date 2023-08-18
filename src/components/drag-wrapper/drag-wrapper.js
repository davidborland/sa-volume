import { useContext, useState } from 'react';
import { 
  DataContext, DATA_SET_IMAGES, DATA_SET_MASKS,
  ErrorContext, LoadingError, ERROR_SET_MESSAGE
} from 'contexts';
import { DragTarget, LoadingIndicator } from 'components/drag-wrapper';
import { loadTIFF, getEmbedding, loadTIFFMask } from 'utils/imageUtils';

export const DragWrapper = ({ show, children }) => {
  const [{ images }, dataDispatch] = useContext(DataContext);
  const [, errorDispatch] = useContext(ErrorContext);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState(null);

  const [toLoad, setToLoad] = useState(null);
  const [loaded, setLoaded] = useState(null);

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

  const reset = () => {
    setDragging(false);
    setFileName(null);
    setToLoad(null);
    setLoaded(null);
  };

  const onDrop = async (evt, type) => {
    evt.preventDefault();

    const file = evt.dataTransfer.files[0];

    try {
      // Check file type
      if (file.type !== 'image/tiff') {
        throw new LoadingError(
          `Wrong file type: ${ file.type ? file.type : 'unknown' }`,
          'Please upload a single multi-page TIFF file (image/tiff)'
        );
      }

      setFileName(file.name);

      if (type === 'mask') {
        const { masks, width, height } = await loadTIFFMask(file);

        const image = images && images.length > 0 ? images[0] : null;

        // Check for image data
        if (!image) {
          throw new LoadingError(
            'No image loaded',
            'Please upload an image' 
          );
        }

        // Check for dimension mismatch
        if (masks.length !== images.length || width !== image.width || height !== image.height) {
          throw new LoadingError(
            'Dimension mismatch',
            `Mask dimensions (${ width }x${ height }x${ masks.length}) do not match image dimensions (${ image.width }x${ image.height }x${ images.length })`
          );
        }

        dataDispatch({ 
          type: DATA_SET_MASKS, 
          maskName: file.name, 
          masks: masks
        });

        reset();
      }
      else {
        const images = await loadTIFF(file);

        setToLoad(images.length);
        setLoaded(0);

        // Load embeddings and keep track of progress
        const embeddings = [];
        for (const image of images) {
          getEmbedding(image).then(embedding => {
            embeddings.push(embedding);

            setLoaded(embeddings.length);

            if (embeddings.length === images.length) {
              dataDispatch({ 
                type: DATA_SET_IMAGES, 
                imageName: file.name, 
                images: images, 
                embeddings: embeddings 
              });

              reset();
            }
          });
        }      
      }
    }
    catch (error) {
      errorDispatch({
        type: ERROR_SET_MESSAGE,
        heading: error.heading,
        message: error.message
      });

      reset();
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: show ? '1 / 1' : null,
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
            <LoadingIndicator fileName={ fileName } toLoad={ toLoad } loaded={ loaded } />
          :
            <>
              <DragTarget 
                type='image' 
                text={ show ? 'Drag and drop image' : 'Load new image' }              
                onDrop={ onDrop } 
              />          
              { !show && 
                <DragTarget 
                  type='mask'
                  text='Load mask for current image'
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