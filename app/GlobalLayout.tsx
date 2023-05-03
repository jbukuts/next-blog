'use client';

import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from 'next-themes';
import React from 'react';
import { Footer, Header } from '@/components/index';
// import useCurrentPath from '@/hooks/useCurrentPath';
import { TitleProvider } from 'src/state/TitleContext';

interface GlobalLayoutProps {
  children: React.ReactNode;
}

const GlobalLayout = (props: GlobalLayoutProps) => {
  const { children } = props;

  // const page = useCurrentPath();

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, [page]);

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
