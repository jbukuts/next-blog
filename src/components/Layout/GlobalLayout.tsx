'use client';

import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from 'next-themes';
import React, { useEffect } from 'react';
import useCurrentPath from '@/hooks/useCurrentPath';
import { TitleProvider } from 'src/state/TitleContext';
import Footer from './Footer';
import Header from './Header';

interface GlobalLayoutProps {
  children: React.ReactNode;
}

const GlobalLayout = (props: GlobalLayoutProps) => {
  const { children } = props;

  const page = useCurrentPath();

  useEffect(() => {
    const url = new URL(window.location.href);
    if (!url.hash) window.scrollTo(0, 0);
  }, [page]);

  return (
    <ThemeProvider defaultTheme='dark'>
      <TitleProvider>
        <Header />
        {children}
      </TitleProvider>
      <Footer />
      <Analytics />
    </ThemeProvider>
  );
};

export default GlobalLayout;
