import { useState, useRef } from 'react';
import { rescale } from 'utils/math';

export const Slider = ({ 
  label, 
  description,
  value = 0,
  defaultValue = null,
  min = 0, 
  max = 100, 
  outputMin = 0, 
  outputMax = 100,
  onChange = null,
  onMouseUp = null
}) => {
  const [sliderValue, setSliderValue] = useState(value);
  const initialValue = useRef(value);

  const handleChange = evt => {
    const value = rescale(+evt.target.value, min, max, outputMin, outputMax);
    setSliderValue(value);

    if (onChange) onChange(value);
  };

  const handleMouseUp = () => {
    if (onMouseUp) onMouseUp(sliderValue);
  };

  const onLabelClick = () => {
    const value = defaultValue !== null ? defaultValue : initialValue.current;

    setSliderValue(value);

    if (onChange) onChange(value);
    if (onMouseUp) onMouseUp(value);
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}
      >
        { label &&
          <label 
            style={{ cursor: 'pointer' }}
            onClick={ onLabelClick }
          >
            { label }
          </label>
        }
        <input 
          type='range' 
          min={ min } 
          max={ max } 
          value={ rescale(sliderValue, outputMin, outputMax, min, max) } 
          onChange={ handleChange }
          onMouseUp={ handleMouseUp } 
        />
      </div>
      { description && 
        <div className='small text-muted'>{ description }</div>
      }
    </div>
  );
};