import { useContext, useState } from 'react';
import { Modal, Buton, } from 'react-bootstrap';
import { 
  DataContext, DATA_SET_IMAGES, DATA_SET_MASKS,
} from 'contexts';

const { Body } = Modal;

// XXX: Rename to EmbeddingsChooser?
export const EmbeddingsMethod = (show, onHide) => {
  return (
      <Modal 
        show={ show } 
        onHide={ onHide }
      >
        <Body>
          hello
        </Body>
      </Modal>
  );
};


if (type === 'embeddings') {
  const embeddings = await loadEmbeddingsFile(file);      

              dataDispatch({ 
        type: DATA_SET_IMAGES, 
        imageName: 'testing.tif', 
        images: images, 
        embeddings: embeddings 
      });  

      reset();

  return;
}