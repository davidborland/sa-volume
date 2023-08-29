import { useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import { DataContext } from 'contexts';
import { SamWrapper } from 'components/slice-view';

export const SliceView = () => {  
  const [{ imageName, images, embeddings, masks }] = useContext(DataContext);

  const wrapper = <SamWrapper 
    imageName={ imageName }
    images={ images } 
    embeddings={ embeddings }
    masks={ masks }
  />

  return (
    <Row>
      <Col>
        <div>
          { wrapper }
        </div>
      </Col>
    </Row>
  );
};
