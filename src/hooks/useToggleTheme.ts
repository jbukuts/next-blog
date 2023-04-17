import { useTheme } from 'next-themes';

const useToggleTheme = (): [string, () => void] => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return [theme || 'light', toggleTheme];
};

export default useToggleTheme;
