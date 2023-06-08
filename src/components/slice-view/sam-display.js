import { useContext } from 'react';
import { OptionsContext } from 'contexts';

const pairs = a => a.reduce((pairs, item, i) => {
  if (i % 2 === 0) {
    pairs.push([item]);
  }
  else {
    pairs[pairs.length - 1].push(item);
  }
  return pairs;
}, []);

export const SamDisplay = ({ image, maskImage, points, imageSize, displaySize, labelColor }) => {
  const [{ interpolate, maskOpacity }] = useContext(OptionsContext);

  const imageToDisplay = v => v / imageSize * displaySize;

  const boxes = points ? pairs(points.filter(({ clickType }) => clickType === 2 || clickType === 3)) : [];
  const justPoints = points ? points.filter(({ clickType }) => clickType === 0 || clickType === 1) : [];

  return (
    <>
      { image && 
        <img 
          style={{ 
            width: '100%', 
            aspectRatio: '1 / 1', 
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
            aspectRatio: '1 / 1', 
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
            top: imageToDisplay(y) - (clickType === 0 ? 26 : 25),
            left: imageToDisplay(x) - (clickType === 0 ? 6 : 11),
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