import { useContext, useState } from 'react';
import { Modal, Button, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { Gear } from 'react-bootstrap-icons';
import { 
  OptionsContext, OPTIONS_SET_INTERPOLATE, OPTIONS_SET_VISUALIZATION_OPACITY, OPTIONS_SET_VISUALIZATION_TYPE, OPTIONS_SET_THRESHOLD
} from 'contexts';
import { Checkbox, Slider } from 'components/widgets';

const { Body } = Modal;

export const Options = ({ disabled }) => {
  const [{ 
    interpolate, visualizationType, visualizationOpacity, threshold }, 
    optionsDispatch
  ] = useContext(OptionsContext);
  const [showModal, setShowModal] = useState(false);

  const onShow = () => setShowModal(true);
  const onHide = () => setShowModal(false);

  const onInterpolateChange = checked => {
    optionsDispatch({ type: OPTIONS_SET_INTERPOLATE, interpolate: checked });
  };

  const onVisualizationTypeChange = value => {
    optionsDispatch({ type: OPTIONS_SET_VISUALIZATION_TYPE, visualizationType: value });
  };

  const onVisualizationOpacityChange = value => {
    optionsDispatch({ type: OPTIONS_SET_VISUALIZATION_OPACITY, visualizationOpacity: value });
  };

  const onThresholdChange = value => {
    optionsDispatch({ type: OPTIONS_SET_THRESHOLD, threshold: value });
  };

  return (
    <>
      <Button 
        variant='outline-secondary' 
        style={{ border: 'none' }} 
        disabled={ disabled }
        onClick={ onShow }
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
            <div 
              style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 10             
              }}>
              <div>Visualization</div>
              <ToggleButtonGroup 
                type='radio'
                name='visualizationType'
                size="sm"
                value={ visualizationType }
                onChange={ onVisualizationTypeChange }
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
            <Slider 
              label='Visualization opacity'
              //description='Opacity of mask image.'
              value={ visualizationOpacity }
              defaultValue={ 0.8 }
              min={ 0 }
              max={ 100 }
              outputMin={ 0 }
              outputMax={ 1 }        
              onChange={ onVisualizationOpacityChange }
            /> 
            <Slider 
              label='Threshold'
              description='Threshold for converting segment anything probabilities to binary mask. Usually best to leave at the default value.'
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