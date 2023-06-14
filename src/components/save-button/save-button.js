import { Button } from 'react-bootstrap';
import { Download } from 'react-bootstrap-icons';

export const SaveButton = ({ disabled, onSave }) => {
  return (
    <Button 
      variant='outline-secondary'  
      style={{ border: 'none' }}
      disabled={ disabled }
      onClick={ onSave }
    >
      <Download />
    </Button>
  );
};