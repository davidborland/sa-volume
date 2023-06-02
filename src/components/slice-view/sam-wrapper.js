import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { SamDisplay } from './sam-display';
import { useSam, useResize } from 'hooks';
import { applyLabel, combineMasks, maskToImage, getLabel, deleteLabel } from 'utils/maskUtils';
import { getLabelColorHex } from 'utils/colors';

// Utility functions
const clamp = (value, min, max) => Math.max(min, Math.min(value, max));
const combineArrays = (a1, a2) => a1?.length && a2?.length ? [...a1, ...a2] : a2?.length ? a2 : a1;

const getRelativePosition = (evt, div) => {
  const rect = div.getBoundingClientRect();

  return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
};

const getLabels = masks => [...new Set(masks.filter(mask => mask).flat())].filter(label => label !== 0);
const getNewLabel = masks => Math.max(...getLabels(masks)) + 1;

export const SamWrapper = ({ imageInfo }) => {
  // Get image information
  const { imageNames, embeddingNames, numImages, imageSize } = imageInfo;

  // State
  const [points, setPoints] = useState([]);
  const [tempPoints, setTempPoints] = useState();
  const [threshold, setThreshold] = useState(0.5);
  const [imageName, setImageName] = useState(imageNames[0]);
  const [embeddingName, setEmbeddingName] = useState(embeddingNames[0]);
  const [displayMask, setDisplayMask] = useState();
  const [maskImage, setMaskImage] = useState();
  const [label, setLabel] =  useState(1);
  //const [displaySize, setDisplaySize] = useState(1);
  const [overWrite, setOverWrite] = useState(false);

  // Div reference
  const div = useRef();
  const { width: displaySize } = useResize(div);

  // Mouse event info
  const mouseDownPoint = useRef();
  const mouseDownButton = useRef();
  const mouseMoved = useRef(false);
  const mousePoint = useRef();

  // Other references
  const slice = useRef(0);
  const savedMasks = useRef(Array(numImages).fill(null));

  // Compute mask using segment anything (sam)
  const combinedPoints = useMemo(() => combineArrays(points, tempPoints), [points, tempPoints]);
  const { image, mask } = useSam(imageName, embeddingName, combinedPoints, threshold);

  // Compute original image coordinates from image display coordinates
  const displayToImage = useCallback(v => v / displaySize * imageSize, [displaySize, imageSize]);

  // Get point coordinates from event
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

  /*
  // Update display size
  useEffect(() => {
    if (div.current && div.current.clientWidth !== displaySize) {
      setDisplaySize(div.current.clientWidth);
    }
  }, [displaySize]);
  */

  // Compute new display mask from saved mask and most recent sam result
  useEffect(() => {
    const savedMask = savedMasks.current[slice.current];

    if (!savedMask && !mask) {
      setMaskImage(null);
      return;
    }

    const labelMask = mask ? applyLabel(mask, label) : null;
    const displayMask = combineMasks(savedMask, labelMask, overWrite);

    setDisplayMask(displayMask);
    setMaskImage(maskToImage(displayMask, imageSize, imageSize));
  }, [embeddingName, mask, imageSize, label, overWrite]);

  // Event callbacks

  const onMouseDown = evt => {
    // Check for only one click at a time
    if (mouseDownPoint.current || mouseDownButton.current) return;

    mouseDownPoint.current = getPoint(evt);
    mouseDownButton.current = evt.button;
    mouseMoved.current = false;
  };

  // Capture mouse moves for entire screen to handle bounding box
  const onMouseMove = useCallback(evt => {
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
  }, [getPoint]);

  // Capture mouse moves for entire screen to handle bounding box
  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);

    return () => document.removeEventListener('mousemove', onMouseMove);
  }, [onMouseMove]);

  const onMouseUp = useCallback(evt => {
    if (!div.current || mouseDownButton.current !== evt.button) return; 

    mousePoint.current = getPoint(getRelativePosition(evt, div.current));

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
            mask ? applyLabel(mask, label) : null, overWrite
          );        

          // Pick for new label
          const newLabel = getLabel(displayMask, Math.round(mousePoint.current.x), Math.round(mousePoint.current.y), imageSize);

          if (newLabel === 0) {
            setLabel(getNewLabel(savedMasks.current));
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
        const label = getLabel(displayMask, Math.round(mousePoint.current.x), Math.round(mousePoint.current.y), imageSize);

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
  }, [displayMask, getPoint, imageSize, label, mask, points, tempPoints, overWrite]);

  // Capture mouse up for entire screen to handle bounding box
  useEffect(() => {
    document.addEventListener('mouseup', onMouseUp);

    return () => document.removeEventListener('mouseup', onMouseUp);
  }, [onMouseUp]);

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
        setOverWrite(true);
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
        setOverWrite(false);
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
          margin: 0,
          border: '1px solid #424549'
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
        <label>Slice: { slice.current + 1}</label>
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