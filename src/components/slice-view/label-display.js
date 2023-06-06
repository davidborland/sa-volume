import { getLabelColorHex } from 'utils/colors';

export const LabelDisplay = ({ label }) => {
  return (
    <div 
      style={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: 5
      }}
    >
      <label>Label:</label>
      <div 
        style={{ 
          background: getLabelColorHex(label), 
          width: '1em', 
          height: '1em',
          borderRadius: '.5em'
        }} 
      />
      <label>{ label }</label>
    </div>
  );
};