import { useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import { DataContext } from 'contexts';
import { NiftiWrapper, SamWrapper } from 'components/slice-view';

//const niftiUrl = `${ process.env.PUBLIC_URL }/data/images/test_image/test_image.nii`;

export const SliceView = () => {  
  const [{ imageName, images, embeddings, masks }] = useContext(DataContext);

  //const wrapper = <NiftiWrapper url={ niftiUrl } />;
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
