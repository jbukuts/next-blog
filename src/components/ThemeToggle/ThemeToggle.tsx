import React from 'react';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { useToggleTheme } from '../../hooks';
import { Stack, Toggle } from '../UI';

const ThemeToggle = () => {
  const [theme, toggleTheme] = useToggleTheme();
  return (
    <Stack style={{ alignItems: 'center' }}>
      <MdLightMode size={20} />
      <Toggle
        id='theme-toggle'
        ariaLabel='theme toggle'
        onClick={toggleTheme}
        defaultChecked={theme === 'dark'}
      />
      <MdDarkMode size={20} />
    </Stack>
  );
};

export default ThemeToggle;
