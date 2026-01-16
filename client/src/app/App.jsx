import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { router } from './routes';

export default function App() {
  return (
    <HelmetProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </HelmetProvider>
  );
}
