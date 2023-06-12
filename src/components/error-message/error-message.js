import { useContext } from 'react';
import { Modal } from 'react-bootstrap';
import { ErrorContext, ERROR_CLEAR_MESSAGE } from 'contexts';

const { Header, Title, Body } = Modal;

export const ErrorMessage = () => {
  const [{ heading, message }, errorDispatch] = useContext(ErrorContext);

  const onHide = () => {
    errorDispatch({ type: ERROR_CLEAR_MESSAGE })
  }

  return (
    <Modal         
      show={ heading || message } 
      onHide={ onHide }
    >
      { heading && 
        <Header>
          <Title>{ heading }</Title>
        </Header>
      }
      { message &&
        <Body>{ message }</Body>
      }
    </Modal>
  );
};