import { Button } from 'react-bootstrap';
import { Download } from 'react-bootstrap-icons';

export const SaveButton = () => {
  const onClick = () => {
    console.log("SAVE")
  };

  return (
    <Button 
      variant='outline-secondary'  
      onClick={ onClick }
      style={{ border: 'none' }}
    >
      <Download />
    </Button>
  );
};