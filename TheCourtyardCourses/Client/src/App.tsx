import { useEffect } from 'react';
import HomePage from './pages/HomePage';
import { useAppSelector } from './app/hooks';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CoursesPage from './pages/CoursesPage';
import LoginPage from './pages/LoginPage';
import { Toaster } from 'sonner';

const App = () => {
  const theme = useAppSelector((state) => state.theme.mode);
  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.setAttribute('data-theme', '');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
        <Toaster
          position="top-right"
          richColors={false}
          className="z-50"
          toastOptions={{
            classNames: {
              toast: 'victorian-toast',
              success: 'toast-success',
              error: 'toast-error',
              warning: 'toast-warning',
              info: 'toast-info',
            },
          }}
        />
      </main>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
