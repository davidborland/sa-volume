import { useState } from 'react';
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { Form } from 'react-bootstrap';

export const Toggle = ({ 
  label, 
  description,
  values = [],
  value = null,
  onChange = null
}) => {
  const [currentValue, setCurrentValue] = useState(value);

  const handleChange = value => {
    setCurrentValue(value);

    if (onChange) onChange(value);
  };

  const onLabelClick = () => {
    const index = values.indexOf(currentValue);
    const newValue = values[(index + 1) % 2];

    setCurrentValue(newValue);

    if (onChange) onChange(newValue);
  };

  return (
    <div>
      <div 
        style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: 10             
        }}>
        { label &&
          <label 
            style={{ cursor: 'pointer' }}
            onClick={ onLabelClick }
          >
            { label }
          </label>
        }
        <ToggleButtonGroup 
          type='radio'
          name='visualizationType'
          size="sm"
          value={ currentValue }
          onChange={ handleChange }
        >
          <ToggleButton 
            id='toggle-borders'
            variant='outline-secondary'
            value='borders'
          >
            Border
          </ToggleButton>
          <ToggleButton
            id='toggle-masks'
            variant='outline-secondary'
            value='masks'
          >
            Mask
          </ToggleButton>            
        </ToggleButtonGroup>
      </div>
      { description && 
          <div className='small text-muted'>{ description }</div>
        }
    </div>
  );
};