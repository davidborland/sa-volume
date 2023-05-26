import { useState, useRef, useMemo, useEffect } from 'react';
import { SamDisplay } from './sam-display';
import { useSam } from 'hooks';
import { applyLabel, combineMasks, maskToImage } from 'utils';

const combineArrays = (a1, a2) => a1?.length && a2?.length ? [...a1, ...a2] : a2?.length ? a2 : a1;
const pairs = a => a.reduce((pairs, item, i) => {
  if (i % 2 === 0) {
    pairs.push([item]);
  }
  else {
    pairs[pairs.length - 1].push(item);
  }
  return pairs;
}, []);

export const SamWrapper = ({ imageInfo }) => {
  const { imageNames, embeddingNames, numImages, imageSize } = imageInfo;

  const [points, setPoints] = useState();
  const [tempPoints, setTempPoints] = useState();
  const [threshold, setThreshold] = useState(0.5);
  const [imageName, setImageName] = useState(imageNames[0]);
  const [embeddingName, setEmbeddingName] = useState(embeddingNames[0]);
  const [maskImage, setMaskImage] = useState();
  const [displaySize, setDisplaySize] = useState(100);

  const div = useRef();
  const mouseDownPoint = useRef();
  const mousePoint = useRef();
  const mouseMoved = useRef(false);
  const slice = useRef(0);
  const label = useRef(0);
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

  useEffect(() => {
    if (div.current && div.current.clientWidth !== displaySize) {
      setDisplaySize(div.current.clientWidth);
    }
  }, [displaySize]);

  useEffect(() => {
    const savedMask = savedMasks.current[slice.current];

    if (!savedMask && !mask) {
      setMaskImage(null);
      return;
    }

    const labelMask = mask ? applyLabel(mask, label.current) : null;
    const displayMask = combineMasks(savedMask, labelMask, overWrite.current);

    setMaskImage(maskToImage(displayMask, imageSize, imageSize));
  }, [embeddingName, mask, imageSize]);

  const onMouseDown = evt => {        
    mouseDownPoint.current = getPoint(evt);
    mouseMoved.current = false;
  };

  const onMouseMove = evt => {  
    evt.preventDefault();

    mousePoint.current = getPoint(evt);

    if (mouseDownPoint.current) {
      // Box
      setPoints();

      setTempPoints([
        { ...mouseDownPoint.current, clickType: 2 },
        { ...mousePoint.current, clickType: 3 }
      ]);

      if (!mouseMoved.current) {
        savedMasks.current[slice.current] = combineMasks(
          savedMasks.current[slice.current], 
          mask ? applyLabel(mask, label.current) : null, overWrite.current
        );
        label.current++;        
      }
    }
    else {
      if (evt.altKey || evt.shiftKey) {
        // Point
        setTempPoints([{ ...mousePoint.current, clickType: evt.shiftKey ? 0 : 1 }]);
      }
    }

    mouseMoved.current = true;
  };

  const onMouseUp = evt => {
    if (!mouseDownPoint.current) return;

    mouseDownPoint.current = null;
    
    setPoints(combineArrays(points, tempPoints));
    setTempPoints();
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
        mask ? applyLabel(mask, label.current) : null, overWrite.current
      );

      // XXX: Total hack to simulate not changing label for new slice
      label.current--;

      slice.current = newSlice;
      setImageName(imageNames[newSlice]);   
      setEmbeddingName(embeddingNames[newSlice]);

      setPoints();   
      setTempPoints();
    }
  };

  const boxes = combinedPoints ? pairs(combinedPoints.filter(({ clickType }) => clickType === 2 || clickType === 3)) : [];
  const justPoints = combinedPoints ? combinedPoints.filter(({ clickType }) => clickType === 0 || clickType === 1) : [];

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
      <div><label>Threshold</label><input type='range' min={ 0 } max={ 100 } defaultValue={ 50 } onMouseUp={ onThresholdChange } /></div>
    </>
  );
};