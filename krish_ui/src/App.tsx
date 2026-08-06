import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppRouter from './router/AppRouter';
import { AppProvider } from './context/AppContext';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Toaster position="top-center" />
        <AppRouter />
      </AppProvider>
    </BrowserRouter>
  );
}
