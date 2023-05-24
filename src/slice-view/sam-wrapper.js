import { useState, useRef, useMemo } from 'react';
import { useSam } from 'hooks';

//const imageBaseName = `${ process.env.PUBLIC_URL }/data/images/test_image/test_image_`;
const imageBaseName = `${ process.env.PUBLIC_URL }/data/images/purple_box/FKP4_L57D855P1_topro_purplebox_x200y1400z0530_`;
const numImages = 8;
const imageSize = 128;
const displaySize = 800;

const getImageName = index => `${ imageBaseName }0${ index + 1 }.png`;
const imageToDisplay = v => v / imageSize * displaySize;
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

export const SamWrapper = () => {
  const [points, setPoints] = useState();
  const [tempPoints, setTempPoints] = useState();
  const [threshold, setThreshold] = useState(0.5);
  const [imageName, setImageName] = useState(getImageName(0));

  const mouseDownPoint = useRef();
  const mousePoint = useRef();
  const mouseMoved = useRef(false);
  const slice = useRef(0);

  const combinedPoints = useMemo(() => combineArrays(points, tempPoints), [points, tempPoints]);

  const { image, maskImage } = useSam(imageName, combinedPoints, threshold);
/*
  const getClickPoints = evt => {
    const { x: eventX, y: eventY } = getEventPosition(evt);
  
    const x = displayToImage(eventX);
    const y = displayToImage(eventY);
  
    const point = { x: x, y: y, clickType: evt.shiftKey ? 0 : 1 };
    const points = (evt.altKey || evt.shiftKey) && clicks ? [...clicks, point] : [point];
  
    return points;
  }
  */
/*
  const onClick = evt => {
    const points = getClickPoints(evt);

    setClicks(points);
    setPoints(points);
  };
*/
  const onMouseDown = evt => {        
    mouseDownPoint.current = getPoint(evt);
    mouseMoved.current = false;
  };

  const onMouseMove = evt => {  
    evt.preventDefault();

    mousePoint.current = getPoint(evt);
    mouseMoved.current = true;

    if (mouseDownPoint.current) {
      // Box
      setPoints();

      setTempPoints([
        { ...mouseDownPoint.current, clickType: 2 },
        { ...mousePoint.current, clickType: 3 }
      ])
    }
    else {
      if (evt.altKey || evt.shiftKey) {
        // Point
        setTempPoints([{ ...mousePoint.current, clickType: evt.shiftKey ? 0 : 1 }]);
      }
    }
  };

  const onMouseUp = evt => {
    if (!mouseDownPoint.current) return;

    mouseDownPoint.current = null;
    
    setPoints(combineArrays(points, tempPoints));
    setTempPoints();
  };

  const onMouseLeave = () => {
    //setPoints(points);
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
      slice.current = newSlice;
      setImageName(getImageName(newSlice));      
    }
  };

  const boxes = combinedPoints ? pairs(combinedPoints.filter(({ clickType }) => clickType === 2 || clickType === 3)) : [];
  const justPoints = combinedPoints ? combinedPoints.filter(({ clickType }) => clickType === 0 || clickType === 1) : [];

  return (
    <>
      <div 
        style={{ 
          position: 'relative', 
          userSelect: 'none' 
        }} 
        onMouseDown={ onMouseDown }        
        onMouseMove={ onMouseMove }
        onMouseUp={ onMouseUp }
        onMouseLeave={ onMouseLeave }
        onKeyDown={ onKeyDown }
        onKeyUp={ onKeyUp }
        onWheel={ onWheel }
        tabIndex={ 0 }
      >
        { image && 
          <img 
            style={{ 
              width: '100%', 
              aspectRatio: '1 / 1', 
              pointerEvents: 'none' 
            }} 
            src={ image.src } 
            alt='original' 
          /> 
        }
        { maskImage && 
          <img 
            style={{ 
              width: '100%', 
              aspectRatio: '1 / 1', 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              pointerEvents: 'none',
              opacity: 0.5
            }} 
            src={ maskImage.src } 
            alt='mask' 
          /> 
        }
        { boxes && boxes.map((box, i) => (
          <div
            key={ i }
            style={{
              position: 'absolute',
              top: imageToDisplay(box[0].y),
              left: imageToDisplay(box[0].x),
              height: imageToDisplay((box[1].y - box[0].y)),
              width: imageToDisplay((box[1].x - box[0].x)),
              pointerEvents: 'none',
              border: '2px dashed #993404'
            }}
          />
        ))}        
        { justPoints && justPoints.map(({ x, y, clickType }, i) => (
          <div
            key={ i }
            style={{
              position: 'absolute',
              // XXX: Hack for + / - offset below
              top: imageToDisplay(y) - (clickType === 0 ? 26 : 25),
              left: imageToDisplay(x) - (clickType === 0 ? 6 : 11),
              pointerEvents: 'none',
              color: '#993404',
              fontWeight: 'bold',
              fontSize: 32
            }}
          >
            { clickType === 0 ? '-' : '+'}
          </div>
        ))}
      </div>      
      <div><label>Slice: { slice.current }</label></div>
      <div><label>Threshold</label><input type='range' min={ 0 } max={ 100 } defaultValue={ 50 } onMouseUp={ onThresholdChange } /></div>
    </>
  );
};