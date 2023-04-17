import React, { createContext, useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from '../hooks';

type theme = 'light' | 'dark';

interface ThemeProviderProps {
  children?: React.ReactNode;
  defaultTheme?: theme;
}

interface ThemeWrapperProps extends ThemeProviderProps {
  as?: any;
  [asProp: string]: any;
}

const ThemContext = createContext({
  currentTheme: 'light' as theme,
  toggleTheme: (() => null) as React.Dispatch<React.SetStateAction<void>>
});

const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'light'
}) => {
  const [localTheme, setLocalTheme] = useLocalStorage('theme', defaultTheme);

  const [currentTheme, setCurrentTheme] = useState(localTheme);
  const memoTheme = useMemo(
    () => ({
      currentTheme,
      toggleTheme: () =>
        setCurrentTheme((curr: theme) => (curr === 'light' ? 'dark' : 'light'))
    }),
    [currentTheme]
  );

  useEffect(() => {
    setLocalTheme(currentTheme);
    document.querySelector('html')?.setAttribute('data-theme', currentTheme);
  }, [currentTheme, setLocalTheme]);

  return (
    <ThemContext.Provider value={memoTheme}>{children}</ThemContext.Provider>
  );
};

const ThemeWrapper: React.FC<ThemeWrapperProps> = ({
  children,
  defaultTheme = 'light',
  as = 'div',
  ...asProps
}) => (
  <ThemeProvider defaultTheme={defaultTheme}>
    <ThemContext.Consumer>
      {(value) =>
        React.createElement(
          as,
          {
            ...asProps,
            className: 'theme-wrapper',
            'data-theme': value.currentTheme
          },
          children
        )
      }
    </ThemContext.Consumer>
  </ThemeProvider>
);

export { ThemeProvider, ThemeWrapper };
export default ThemContext;
