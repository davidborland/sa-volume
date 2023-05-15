import { NiftiWrapper } from 'slice-view';

const niftiUrl = `${ process.env.PUBLIC_URL }/data/test_image.nii`;

export const App = () => {
  return (
    <div>
      <NiftiWrapper url={ niftiUrl } />
    </div>
  );
};
