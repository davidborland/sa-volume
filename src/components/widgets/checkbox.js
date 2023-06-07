import { useState, useRef } from 'react';
import { Form } from 'react-bootstrap';

export const Checkbox = ({ 
  label, 
  description,
  checked = false,
  onChange = null
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleChange = evt => {
    const checked = evt.target.checked;
    setIsChecked(checked);

    if (onChange) onChange(checked);
  };

  const onLabelClick = () => {
    const checked = !isChecked;

    setIsChecked(checked);

    if (onChange) onChange(checked);
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5
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
        <Form.Check 
          type='checkbox'
          checked={ isChecked} 
          onChange={ handleChange }
        />        
      </div>
      { description && 
        <div className='small text-muted'>{ description }</div>
      }
    </div>
  );
};