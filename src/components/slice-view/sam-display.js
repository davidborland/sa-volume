import { useContext } from 'react';
import { OptionsContext } from 'contexts';
import { maskToImage, borderPoints } from 'utils/imageUtils';
import { getLabelColorHex } from 'utils/colors';

const pairs = a => a.reduce((pairs, item, i) => {
  if (i % 2 === 0) {
    pairs.push([item]);
  }
  else {
    pairs[pairs.length - 1].push(item);
  }
  return pairs;
}, []);

export const SamDisplay = ({ 
  image, mask, label, points, imageWidth, imageHeight, displayWidth, displayHeight 
}) => {
  const [{ interpolate, showBorder, maskOpacity }] = useContext(OptionsContext);

  const imageToDisplayX = x => x / imageWidth * displayWidth;
  const imageToDisplayY = y => y / imageHeight * displayHeight;

  const labelColor = getLabelColorHex(label);

  let maskImage = mask && !showBorder ? maskToImage(mask, imageWidth, imageHeight, label) : null;
  let border = mask && showBorder ? borderPoints(mask, imageWidth, imageHeight).map(({ p1, p2, label }) => (
    {
      p1: { x: imageToDisplayX(p1.x), y: imageToDisplayY(p1.y) },
      p2: { x: imageToDisplayX(p2.x), y: imageToDisplayY(p2.y) },
      label
    }
  )) : null;

  const boxes = points ? pairs(points.filter(({ clickType }) => clickType === 2 || clickType === 3)) : [];
  const justPoints = points ? points.filter(({ clickType }) => clickType === 0 || clickType === 1) : [];

  const aspectRatio = `${ imageWidth } / ${ imageHeight }`;

  return (
    <>
      { image && 
        <img 
          style={{ 
            width: '100%', 
            aspectRatio: aspectRatio, 
            pointerEvents: 'none',
            imageRendering: interpolate ? null : 'pixelated'
          }} 
          src={ image.src } 
          alt='original' 
        /> 
      }
      { maskImage &&
        <img 
          style={{ 
            width: '100%', 
            aspectRatio: aspectRatio, 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            pointerEvents: 'none',
            opacity: maskOpacity
          }} 
          src={ maskImage.src } 
          alt='mask' 
        /> 
      }
      { border && 
        <div 
          style={{ 
            width: '100%', 
            aspectRatio: aspectRatio, 
            position: 'absolute',
            top: 0, 
            left: 0, 
            pointerEvents: 'none',
            opacity: maskOpacity
          }}
        >
          <svg
            style={{ 
              width: '100%', 
              height: '100%'
            }}
          >
            { border.map(({ p1, p2, label: borderLabel }, i) =>  
              <line 
                key={ i }
                x1={ p1.x } y1={ p1.y } x2={ p2.x } y2={ p2.y } 
                stroke={ getLabelColorHex(borderLabel) }
                strokeWidth={ borderLabel === label ? 2 : 1 }
              /> 
            )}
          </svg>
        </div>
      }
      { boxes && boxes.map((box, i) => (
        <div
          key={ i }
          style={{
            position: 'absolute',
            top: imageToDisplayY(box[0].y),
            left: imageToDisplayX(box[0].x),
            height: imageToDisplayY(box[1].y - box[0].y),
            width: imageToDisplayX(box[1].x - box[0].x),
            pointerEvents: 'none',
            border: '2px dashed #993404',
            borderColor: labelColor,
            opacity: 0.5
          }}
        />
      ))}        
      { justPoints && justPoints.map(({ x, y, clickType }, i) => (
        <div
          key={ i }
          style={{
            position: 'absolute',
            // XXX: Hack for + / - offset below
            top: imageToDisplayY(y) - (clickType === 0 ? 26 : 25),
            left: imageToDisplayX(x) - (clickType === 0 ? 6 : 11),
            pointerEvents: 'none',
            color: labelColor,
            fontWeight: 'bold',
            fontSize: 32,
            opacity: 0.75
          }}
        >
          { clickType === 0 ? '-' : '+'}
        </div>
      ))}
    </>
  );
};