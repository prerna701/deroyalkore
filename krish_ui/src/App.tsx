import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router/AppRouter';
import { AppProvider } from './context/AppContext';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </BrowserRouter>
  );
}
