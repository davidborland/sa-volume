import { SliceMarker, LabelDisplay } from 'components/slice-view';
import { SaveButton } from 'components/save-button';
import { Options } from 'components/options';

export const SliceHeader = ({ numImages, slice, label }) => {
  return (    
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <div>
        <SliceMarker 
          numImages={ numImages } 
          slice={ slice } 
        />
      </div>
      <div>
        <LabelDisplay label={ label } />
      </div>
      <div>
        <SaveButton />
        <Options />
      </div>
    </div>
  );
};