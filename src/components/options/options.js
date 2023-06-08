import { useContext, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Gear } from 'react-bootstrap-icons';
import { 
  OptionsContext, OPTIONS_SET_INTERPOLATE, OPTIONS_SET_MASK_OPACITY, OPTIONS_SET_SHOW_BORDER, OPTIONS_SET_THRESHOLD
} from 'contexts';
import { Checkbox, Slider } from 'components/widgets';

const { Body } = Modal;

export const Options = () => {
  const [{ 
    interpolate, showBorder, maskOpacity, threshold }, 
    optionsDispatch
  ] = useContext(OptionsContext);
  const [showModal, setShow] = useState(false);

  const onShow = () => setShow(true);
  const onHide = () => setShow(false);

  const onInterpolateChange = checked => {
    optionsDispatch({ type: OPTIONS_SET_INTERPOLATE, interpolate: checked });
  };

  const onShowBorderChange = checked => {
    optionsDispatch({ type: OPTIONS_SET_SHOW_BORDER, showBorder: checked });
  };

  const onMaskOpacityChange = value => {
    optionsDispatch({ type: OPTIONS_SET_MASK_OPACITY, maskOpacity: value });
  };

  const onThresholdChange = value => {
    optionsDispatch({ type: OPTIONS_SET_THRESHOLD, threshold: value });
  };

  return (
    <>
      <Button 
        variant='outline-secondary'  
        onClick={ onShow }
        style={{ border: 'none' }}
      >
        <Gear />
      </Button>
      <Modal 
        show={ showModal } 
        onHide={ onHide }
      >
        <Body>
          <div 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', gap: 10 
            }}
          >
            <Checkbox 
              label='Interpolate image'
              //description='Interpolate image pixels.'
              checked={ interpolate }
              onChange={ onInterpolateChange }
            />
            <Checkbox 
              label='Show borders'
              //description='Show regions borders.'
              checked={ showBorder }
              onChange={ onShowBorderChange }
            />
            <Slider 
              label='Mask opacity'
              //description='Opacity of mask image.'
              value={ maskOpacity }
              defaultValue={ 0.8 }
              min={ 0 }
              max={ 100 }
              outputMin={ 0 }
              outputMax={ 1 }        
              onChange={ onMaskOpacityChange }
            /> 
            <Slider 
              label='Threshold'
              description='Threshold for converting probabilities to binary mask. Usually best to leave at the default value.'
              value={ threshold }
              defaultValue={ 0.5 }
              min={ 0 }
              max={ 100 }
              outputMin={ 0 }
              outputMax={ 1 }        
              onMouseUp={ onThresholdChange }
            /> 
          </div>
        </Body>
      </Modal>
    </>
  );
};