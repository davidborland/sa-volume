import { useContext } from 'react';
import { ToggleButton } from 'react-bootstrap';
import { ControlsContext, CONTROLS_SET_SHOW_DOCUMENTATION } from 'contexts';
import { QuestionCircle } from 'react-bootstrap-icons';

export const ControlDocumentationButton = () => {
  const [{ show }, controlsDispatch] = useContext(ControlsContext);

  const onClick = () => {
    controlsDispatch({ type: CONTROLS_SET_SHOW_DOCUMENTATION, show: !show });
  };

  return (
    <ToggleButton 
      type='checkbox'
      variant='outline-secondary' 
      style={{ border: 'none' }} 
      checked={ show }
      onClick={ onClick }
    >
      <QuestionCircle />
    </ToggleButton>
  );
};