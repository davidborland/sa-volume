import { Container, Row, Col } from 'react-bootstrap';
import { OptionsProvider } from 'contexts';
import { NiftiWrapper, SamWrapper } from 'components/slice-view';
import { ControlDocumentation } from 'components/control-documentation';

//const niftiUrl = `${ process.env.PUBLIC_URL }/data/images/test_image/test_image.nii`;

const addNames = imageInfo => {
  const imageNames = [];
  const embeddingNames = [];

  const numDigits = String(imageInfo.numImages).length;

  for (let i = 0; i < imageInfo.numImages; i++)  {
    const n = String(i + 1).padStart(Math.max(2, numDigits), '0');
    const s = `${ imageInfo.baseName }${ n }`;

    imageNames.push(s + '.png');
    embeddingNames.push(s + '.npy');
  }

  return {
    ...imageInfo,
    imageNames,
    embeddingNames
  };
} 

const imageInfo1 = {
  baseName: `${ process.env.PUBLIC_URL }/data/images/test_image/test_image_`,
  numImages: 8,
  imageSize: 48
};

const imageInfo2 = {
  baseName: `${ process.env.PUBLIC_URL }/data/images/purple_box/FKP4_L57D855P1_topro_purplebox_x200y1400z0530_`,
  numImages: 8,
  imageSize: 128
};

export const App = () => {  
  //const wrapper = <NiftiWrapper url={ niftiUrl } />;
  const wrapper = <SamWrapper imageInfo={ addNames(imageInfo2) } />

  return (
    <OptionsProvider>
      <Container fluid className='mt-2'>
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
      </Container>
    </OptionsProvider>
  );
};
