import { useContext, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Gear } from 'react-bootstrap-icons';
import { OptionsContext, OPTIONS_SET_THRESHOLD } from 'contexts';
import { Slider } from 'components/slider';

const { Body } = Modal;

export const Options = () => {
  const [{ threshold }, optionsDispatch] = useContext(OptionsContext);
  const [showModal, setShow] = useState(false);

  const onShow = () => setShow(true);
  const onHide = () => setShow(false);

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
          <Slider 
            label='Threshold:'
            description='Threshold for converting probabilities to binary mask. Usually best to leave at the default.'
            value={ threshold }
            defaultValue={ 0.5 }
            min={ 0 }
            max={ 100 }
            outputMin={ -0 }
            outputMax={ 1 }        
            onMouseUp={ onThresholdChange }
          />
        </Body>
      </Modal>
    </>
  );
};