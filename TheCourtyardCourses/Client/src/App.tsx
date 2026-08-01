import { useEffect } from 'react';
import HomePage from './pages/HomePage';
import { useAppSelector } from './app/hooks';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CoursesPage from './pages/CoursesPage';

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
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
