import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { QuestionCircle } from 'react-bootstrap-icons';

const { Body } = Modal;

export const ControlDocumentation = () => {
  const [showModal, setShowModal] = useState(false);
  const classes = 'small text-muted';

  const onShow = () => setShowModal(true);
  const onHide = () => setShowModal(false);

  return (
    <>
    <Button 
        variant='outline-secondary' 
        style={{ border: 'none' }} 
        onClick={ onShow }
  >
    <QuestionCircle />
  </Button>
  <Modal 
        show={ showModal } 
        onHide={ onHide }
      >
      <Body>
        Left-click and drag
        <ul className={ classes }>
          <li>Draw a bounding box to segment an object using the current label.</li>
          <li>Hold Ctrl/Cmd to overwrite previous segmentations.</li>
        </ul>

        Left-click
        <ul className={ classes }>
          <li>Confirm current segmentation.</li>
          <li>Click the background to generate a new label or an object to continue editing that object.</li>           
          <li>Hold Shift (background) or Alt (foreground) instead to add points to modify current segmentation.</li>
        </ul>

        Right-click
        <ul className={ classes }>
          <li>Click on an object to remove it from the current slice.</li>
        </ul>
        
        Mouse wheel
        <ul className={ classes }>
          <li>Change slice.</li>
          <li>Also confirms current segmentation and keeps current label for new slice.</li>
        </ul>
        
        Esc
        <ul className={ classes }>
          <li>Cancel current segmentation</li>
        </ul>
      </Body>
    </Modal>
    </>
  );
};