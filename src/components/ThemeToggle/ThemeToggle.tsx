'use client';

import React from 'react';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import Stack from '@/components/UI/Stack';
import Toggle from '@/components/UI/Toggle';
import useToggleTheme from '@/hooks/useToggleTheme';

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
