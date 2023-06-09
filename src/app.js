import { Container } from 'react-bootstrap';
import { DataProvider, OptionsProvider } from 'contexts';
import { SliceView } from 'components/slice-view';

export const App = () => {  
  return (
    <DataProvider>
    <OptionsProvider>
      <Container fluid className='mt-2'>
        <SliceView />
      </Container>
    </OptionsProvider>
    </DataProvider>
  );
};
