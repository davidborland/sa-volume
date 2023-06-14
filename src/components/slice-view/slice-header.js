import { Row, Col } from 'react-bootstrap';
import { SliceMarker, LabelDisplay } from 'components/slice-view';
import { SaveButton } from 'components/save-button';
import { Options } from 'components/options';
import { ControlDocumentation } from 'components/control-documentation';

export const SliceHeader = ({ numImages, slice, label, onSave }) => {
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
      <div style={{ visibility: noData ? 'hidden' : null }}>
        <SliceMarker 
          numImages={ numImages } 
          slice={ slice } 
        />
      </div>
      <div style={{ visibility: noData ? 'hidden' : null }}>
        <LabelDisplay label={ label } />
      </div>
      <div>
        <SaveButton 
          disabled={ noData} 
          onSave={ onSave } 
        />
        <Options />
        <ControlDocumentation />
      </div>
    </div>
  );
};