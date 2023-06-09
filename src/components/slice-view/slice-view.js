import { useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import { DataContext } from 'contexts';
import { NiftiWrapper, SamWrapper } from 'components/slice-view';
import { ControlDocumentation } from 'components/control-documentation';

//const niftiUrl = `${ process.env.PUBLIC_URL }/data/images/test_image/test_image.nii`;

export const SliceView = () => {  
  const [{ images, embeddings }] = useContext(DataContext);

  //const wrapper = <NiftiWrapper url={ niftiUrl } />;
  const wrapper = <SamWrapper 
    images={ images } 
    embeddings={ embeddings }
  />

  return (
    <Row>
      <Col>
        <div>
          { wrapper }
        </div>
      </Col>
      <Col md={ 4 }>
        <ControlDocumentation />
      </Col>
    </Row>
  );
};
