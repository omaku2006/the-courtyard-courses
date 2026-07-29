import { useEffect } from 'react';
import HomePage from './pages/HomePage';
import { useAppSelector } from './app/hooks';

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
  return <HomePage />;
};

export default App;
