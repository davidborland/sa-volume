import { NiftiWrapper } from 'slice-view';
import { SamWrapper } from 'slice-view';

const niftiUrl = `${ process.env.PUBLIC_URL }/data/images/test_image/test_image.nii`;

export const App = () => {  
  //const wrapper = <NiftiWrapper url={ niftiUrl } />;
  const wrapper = <SamWrapper />

  return (
    <>
      <div style={{ width: 800 }}>
        { wrapper }
      </div>
    </>
  );
};
