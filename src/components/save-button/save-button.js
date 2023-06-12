import { Button } from 'react-bootstrap';
import { Download } from 'react-bootstrap-icons';

export const SaveButton = ({ onSave }) => {
  return (
    <Button 
      variant='outline-secondary'  
      onClick={ onSave }
      style={{ border: 'none' }}
    >
      <Download />
    </Button>
  );
};