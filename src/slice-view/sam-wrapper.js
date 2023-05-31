import { useState, useRef, useMemo, useEffect } from 'react';
import { SamDisplay } from './sam-display';
import { useSam } from 'hooks';
import { applyLabel, combineMasks, maskToImage } from 'utils';

const combineArrays = (a1, a2) => a1?.length && a2?.length ? [...a1, ...a2] : a2?.length ? a2 : a1;

const getLabel = (mask, x, y, imageSize) => mask ? mask[y * imageSize + x] : 0;

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

  const displayToImage = v => v / displaySize * imageSize;

  const getPoint = evt => {
    const x = evt.nativeEvent.offsetX;
    const y = evt.nativeEvent.offsetY;

    return {
      x: displayToImage(x),
      y: displayToImage(y),
      displayX: x,
      displayY: y
    };
  };

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

  const onMouseMove = evt => {  
    evt.preventDefault();    

    mousePoint.current = getPoint(evt);

    if (mouseDownButton.current === 0) {
      // Box
      setPoints();
      setTempPoints([
        { ...mouseDownPoint.current, clickType: 2 },
        { ...mousePoint.current, clickType: 3 }
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
    }    

    mouseDownPoint.current = null;
    mouseDownButton.current = null;
  };

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
          outline: 'none'
        }} 
        onMouseDown={ onMouseDown }        
        onMouseMove={ onMouseMove }
        onMouseUp={ onMouseUp }
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
      <div><label>Slice: { slice.current }</label></div>
      <div><label>Label: { label }</label></div>
      <div><label>Threshold</label><input type='range' min={ 0 } max={ 100 } defaultValue={ 50 } onMouseUp={ onThresholdChange } /></div>
    </>
  );
};