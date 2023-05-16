import { NiftiWrapper } from 'slice-view';
import { useCornerstone } from 'hooks/use-cornerstone';

const niftiUrl = `${ process.env.PUBLIC_URL }/data/test_image.nii`;

export const App = () => {
  //const initialized = useCornerstone();
  
  return (
    <div>
      { /*initialized && */ <NiftiWrapper url={ niftiUrl } /> }
    </div>
  );
};
