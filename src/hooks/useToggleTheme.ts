import { useTheme } from 'next-themes';

const useToggleTheme = (): [string, () => void] => {
  const { themes, theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return [theme || themes[0], toggleTheme];
};

export default useToggleTheme;
