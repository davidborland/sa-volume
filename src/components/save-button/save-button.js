import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Save, Download } from 'react-bootstrap-icons';

export const SaveButton = ({ type, disabled, onSave }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const onMouseEnter= () => {
    setShowTooltip(true);
  };

  const onMouseLeave = () => {
    setShowTooltip(false);
  }

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={ onMouseEnter }
      onMouseLeave={ onMouseLeave }
    >
      <Button 
        variant='outline-secondary'  
        style={{ border: 'none' }}
        disabled={ disabled }
        onClick={ onSave }
      >
        { type === 'mask' ? <Download /> : <Save /> }
      </Button>
      <div
        className='small'
        style={{ 
          visibility: disabled || !showTooltip ? 'hidden' : null,          
          position: 'absolute',
          top: '100%',
          left: '50%',
          transform: 'translate(-50%, 0)',
          width: '100vw',
          textAlign: 'center',
          pointerEvents: 'none',
          zIndex: 1,
          textShadow: '1px 1px 2px black'
        }}
      >
        Save { type }
      </div>
    </div>
  );
};