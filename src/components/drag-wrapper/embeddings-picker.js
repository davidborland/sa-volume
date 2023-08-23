import { Modal, Button, } from 'react-bootstrap';
import { CloudDownload } from 'react-bootstrap-icons';
import { DragTarget } from 'components/drag-wrapper';

const { Header, Title, Body } = Modal;

export const EmbeddingsPicker = ({ show, onRetrieve, onLoad, onHide }) => {

  const onDrop = evt => {
    evt.preventDefault();

    onLoad(evt.dataTransfer.files[0]);
  };

  return (
      <Modal 
        show={ show } 
        onHide={ onHide }
      >
        <Header>
          <Title>
            Select SAM embeddings for image
          </Title>
        </Header>
        <Body>    
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center'
            }}
          >    
            <div>
              <div
                style={{
                  color: '#adb5bd'               
                }}           
              >
                Retrieve from SAM server
              </div>
              <div className='d-grid'>
                <Button
                  variant='outline-secondary'              
                  style={{
                    color: '#adb5bd'              
                  }}
                  onClick={ onRetrieve }
                >
                <CloudDownload className='mt-1' size={ 48 } />
                </Button>
              </div>
            </div>
            <DragTarget 
              type='embeddings'
              text='Load previously saved'
              onDrop={ onDrop } 
            /> 
          </div>  
        </Body>
      </Modal>
  );
};