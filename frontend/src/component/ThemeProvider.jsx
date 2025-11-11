import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const ThemeProvider = ({ children }) => {
  const theme = useSelector((state) => state.theme.theme);

  useEffect(() => {
    // Set the data-theme attribute on the root element
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return children;
};

export default ThemeProvider;
