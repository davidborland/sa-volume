import { useContext, useState } from 'react';
import { Modal, Buton, } from 'react-bootstrap';
import { 
  DataContext, DATA_SET_IMAGES, DATA_SET_MASKS,
} from 'contexts';

const { Body } = Modal;

export const EmbeddingsLoader = (show, onHide) => {
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