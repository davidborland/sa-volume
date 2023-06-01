import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { SamDisplay } from './sam-display';
import { useSam } from 'hooks';
import { applyLabel, combineMasks, maskToImage, getLabel, deleteLabel } from 'utils/maskUtils';
import { getLabelColorHex } from 'utils/colors';

const clamp = (value, min, max) => Math.max(min, Math.min(value, max));
const combineArrays = (a1, a2) => a1?.length && a2?.length ? [...a1, ...a2] : a2?.length ? a2 : a1;

const getRelativePosition = (evt, div) => {
  const rect = div.getBoundingClientRect();
  const top = rect.top + window.pageYOffset;
  const left = rect.left + window.pageXOffset;

  return { x: evt.clientX - left, y: evt.clientY - top };
};

export const SamWrapper = ({ imageInfo }) => {
  const { imageNames, embeddingNames, numImages, imageSize } = imageInfo;

  const [points, setPoints] = useState([]);
  const [tempPoints, setTempPoints] = useState();
  const [threshold, setThreshold] = useState(0.5);
  const [imageName, setImageName] = useState(imageNames[0]);
  const [embeddingName, setEmbeddingName] = useState(embeddingNames[0]);
  const [displayMask, setDisplayMask] = useState();
  const [maskImage, setMaskImage] = useState();
  const [label, setLabel] =  useState(1);
  const [displaySize, setDisplaySize] = useState(1);

  const div = useRef();

  const mouseDownPoint = useRef();
  const mouseDownButton = useRef();
  const mouseMoved = useRef(false);
  const mousePoint = useRef();

  const slice = useRef(0);
  const maxLabel = useRef(1);
  const savedMasks = useRef(Array(numImages).fill(null));
  const overWrite = useRef(false);

  const displayToImage = useCallback(v => v / displaySize * imageSize, [displaySize, imageSize]);

  const getPoint = useCallback(evt => {
    const x = clamp(evt.nativeEvent ? evt.nativeEvent.offsetX : evt.x, 0, displaySize - 1);
    const y = clamp(evt.nativeEvent ? evt.nativeEvent.offsetY : evt.y, 0, displaySize - 1);

    return {
      x: displayToImage(x),
      y: displayToImage(y),
      displayX: x,
      displayY: y
    };
  }, [displayToImage, displaySize]);

  const combinedPoints = useMemo(() => combineArrays(points, tempPoints), [points, tempPoints]);
  const { image, mask } = useSam(imageName, embeddingName, combinedPoints, threshold);

  // Update display size
  useEffect(() => {
    if (div.current && div.current.clientWidth !== displaySize) {
      setDisplaySize(div.current.clientWidth);
    }
  }, [displaySize]);

  // Compute new mask
  useEffect(() => {
    const savedMask = savedMasks.current[slice.current];

    if (!savedMask && !mask) {
      setMaskImage(null);
      return;
    }

    const labelMask = mask ? applyLabel(mask, label) : null;
    const displayMask = combineMasks(savedMask, labelMask, overWrite.current);

    setDisplayMask(displayMask);
    setMaskImage(maskToImage(displayMask, imageSize, imageSize));
  }, [embeddingName, mask, imageSize, label]);

  const onMouseDown = evt => {
    // Check for only one click at a time
    if (mouseDownPoint.current || mouseDownButton.current) return;

    mouseDownPoint.current = getPoint(evt);
    mouseDownButton.current = evt.button;
    mouseMoved.current = false;
  };

  // Capture mouse moves for entire screen to handle bounding box
  useEffect(() => {
    const onMouseMove = evt => {
      if (!div.current) return; 

      mousePoint.current = getPoint(getRelativePosition(evt, div.current));
  
      if (mouseDownButton.current === 0) {
        // Box
        setPoints();
  
        const top = Math.min(mouseDownPoint.current.y, mousePoint.current.y);
        const left = Math.min(mouseDownPoint.current.x, mousePoint.current.x);
        const bottom = Math.max(mouseDownPoint.current.y, mousePoint.current.y);
        const right = Math.max(mouseDownPoint.current.x, mousePoint.current.x);
  
        setTempPoints([
          { x: left, y: top, clickType: 2 },
          { x: right, y: bottom, clickType: 3 }
        ]);   
      }
      else if (!mouseDownButton.current){
        if (evt.altKey || evt.shiftKey) {
          // Point
          setTempPoints([{ ...mousePoint.current, clickType: evt.shiftKey ? 0 : 1 }]);
        }
      }
  
      mouseMoved.current = true;
    };

    document.addEventListener('mousemove', onMouseMove);

    return () => document.removeEventListener('mousemove', onMouseMove);
  }, [getPoint]);

  // Capture mouse up for entire screen to handle bounding box
  useEffect(() => {
    const onMouseUp = evt => {
      if (mouseDownButton.current !== evt.button) return;

      if (mouseMoved.current) {
        // Drag
        if (mouseDownButton.current === 0) {
          // Save points
          setPoints(tempPoints);
          setTempPoints();
        }
      }
      else {
        // Click
        if (mouseDownButton.current === 0) {    
          if (evt.altKey || evt.shiftKey) {
            // Save points
            setPoints(combineArrays(points, tempPoints));
            setTempPoints();
          }
          else {
            // Save mask 
            savedMasks.current[slice.current] = combineMasks(
              savedMasks.current[slice.current], 
              mask ? applyLabel(mask, label) : null, overWrite.current
            );        

            // Pick for new label
            const point = getPoint(evt);
            const newLabel = getLabel(displayMask, Math.round(point.x), Math.round(point.y), imageSize);

            if (newLabel === 0) {
              maxLabel.current = maxLabel.current + 1;
              setLabel(maxLabel.current);
            }
            else {
              setLabel(newLabel);
            }
            
            // Clear points
            setPoints();
            setTempPoints();
          }
        }
        else if (mouseDownButton.current === 2) {
          // Delete
          const point = getPoint(evt);
          const label = getLabel(displayMask, Math.round(point.x), Math.round(point.y), imageSize);

          if (label !== 0) {
            deleteLabel(savedMasks.current[slice.current], label);
            const displayMask = combineMasks(savedMasks.current[slice.current]);

            setDisplayMask(displayMask);
            setMaskImage(maskToImage(displayMask, imageSize, imageSize));
          }
        }
      }    

      mouseDownPoint.current = null;
      mouseDownButton.current = null;
    };

    document.addEventListener('mouseup', onMouseUp);

    return () => document.removeEventListener('mouseup', onMouseUp);
  }, [displayMask, getPoint, imageSize, label, mask, points, tempPoints]);



  const onKeyDown = evt => {
    evt.preventDefault();

    if (evt.repeat) return;

    switch (evt.key) {
      case 'Alt':
      case 'Shift':
        // Point
        setTempPoints([{ ...mousePoint.current, clickType: evt.shiftKey ? 0 : 1 }]);
        break;
      
      case 'Control':
        // Overwrite
        overWrite.current = true;
        break;
      
      default:
    }
  };

  const onKeyUp = evt => {
    evt.preventDefault();

    switch (evt.key) {
      case 'Alt':
      case 'Shift':
        setTempPoints();
        break;

      case 'Control':
        overWrite.current = false;
        break;

      case 'Escape':
        setPoints();
        setTempPoints();
        break;

      default:
    }
  };

  const onThresholdChange = evt => {
    setThreshold(+evt.target.value / 100);
  };

  const onWheel = evt => {
    const y = evt.deltaY;
    const newSlice = y < 0 ? Math.max(0, slice.current - 1) : 
      y > 0 ? Math.min(slice.current + 1, numImages - 1) : 
      slice.current;

    if (newSlice !== slice.current) {      
      savedMasks.current[slice.current] = combineMasks(
        savedMasks.current[slice.current], 
        mask ? applyLabel(mask, label) : null, overWrite.current
      );

      slice.current = newSlice;

      setImageName(imageNames[newSlice]);   
      setEmbeddingName(embeddingNames[newSlice]);

      setPoints();   
      setTempPoints();
    }
  };

  return (
    <>
      <div 
        ref={ div }
        style={{ 
          position: 'relative', 
          userSelect: 'none',
          outline: 'none',
          padding: 0,
          margin: 0          
        }} 
        onMouseDown={ onMouseDown }  
        onKeyDown={ onKeyDown }
        onKeyUp={ onKeyUp }
        onWheel={ onWheel }
        onContextMenu={ evt => evt.preventDefault() }
        tabIndex={ 0 }
      >
        <SamDisplay 
          image={ image }
          maskImage={ maskImage }
          points={ combinedPoints }
          imageSize={ imageSize }
          displaySize={ displaySize }
        />
      </div>      
      <div>
        <label>Slice: { slice.current }</label>
      </div>
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'baseline' 
        }}
      >
        <label>Label: { label }</label>
        <div 
          style={{ 
            background: getLabelColorHex(label), 
            width: 20, 
            height: '1em',
            borderRadius: 5,
            marginLeft: 5
          }} 
        />
      </div>
      <div>
        <label>Threshold</label>
        <input 
          type='range' 
          min={ 0 } 
          max={ 100 } 
          defaultValue={ 50 } 
          onMouseUp={ onThresholdChange } 
        />
      </div>
    </>
  );
};