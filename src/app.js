import { Container } from 'react-bootstrap';
import { DataProvider, OptionsProvider, ControlsProvider, ErrorProvider } from 'contexts';
import { ErrorMessage } from 'components/error-message';
import { SliceView } from 'components/slice-view';

export const App = () => {  
  return (
    <DataProvider>
    <OptionsProvider>
    <ControlsProvider>
    <ErrorProvider>
      <Container fluid className='mt-2'>
        <SliceView />
        <ErrorMessage />
      </Container>
    </ErrorProvider>
    </ControlsProvider>
    </OptionsProvider>
    </DataProvider>
  );
};
