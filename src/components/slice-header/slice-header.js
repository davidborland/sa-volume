import { SliceMarker } from 'components/slice-marker';
import { LabelDisplay } from 'components/label-display';
import { SaveButton } from 'components/save-button';
import { Options } from 'components/options';
import { ControlDocumentation } from 'components/control-documentation';

export const SliceHeader = ({ numImages, slice, label, onSaveEmbeddings, onSaveMask }) => {
  const noData = numImages === 0;

  return (    
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap-reverse',
        gap: 10
      }}
    >
      <div 
        style={{ visibility: noData ? 'hidden' : null }}>
        <SliceMarker 
          numImages={ numImages } 
          slice={ slice } 
        />
      </div>
      <div style={{ visibility: noData ? 'hidden' : null }}>
        <LabelDisplay label={ label } />
      </div>
      <div 
        style={{ 
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <SaveButton 
          type='embeddings'
          disabled={ noData } 
          onSave={ onSaveEmbeddings } 
        />
        <SaveButton 
          type='mask'
          disabled={ noData } 
          onSave={ onSaveMask } 
        />
        <Options disabled={ noData } />
        <ControlDocumentation />
      </div>
    </div>
  );
};