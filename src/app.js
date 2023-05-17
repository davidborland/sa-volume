import { NiftiWrapper } from 'slice-view';

const niftiUrl = `${ process.env.PUBLIC_URL }/data/images/test_image.nii`;

export const App = () => {  
  return (
    <>
      <div style={{ width: 800 }}>
        <NiftiWrapper url={ niftiUrl } />
      </div>
    </>
  );
};
