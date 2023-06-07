import { useState } from 'react';

const rescale = (value, min, max, outMin, outMax) => (value - min) / (max - min) * (outMax - outMin) + outMin;

export const Slider = ({ 
  label = '', 
  value = 0,
  min = 0, 
  max = 100, 
  outputMin = 0, 
  outputMax = 100,
  onChange = null,
  onMouseUp = null
}) => {
  const [sliderValue, setSliderValue] = useState(value);

  const handleChange = evt => {
    const value = rescale(+evt.target.value, min, max, outputMin, outputMax);
    setSliderValue(value);

    if (onChange) onChange(value);
  };

  const handleMouseUp = () => {
    if (onMouseUp) onMouseUp(sliderValue);
  };

  return (
    <div>
      <label>{ label }</label>
      <input 
        type='range' 
        min={ min } 
        max={ max } 
        value={ rescale(sliderValue, outputMin, outputMax, min, max) } 
        onChange={ handleChange }
        onMouseUp={ handleMouseUp } 
      />
    </div>
  );
};