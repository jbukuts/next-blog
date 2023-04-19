import '../src/styles/globals.scss';
import { Analytics } from '@vercel/analytics/react';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import React, { useMemo, useState } from 'react';
import Footer from '../src/components/Layout/Footer';
import Header from '../src/components/Layout/Header';
import { SharedHeader } from '../src/components/SEO';
import TitleContext from '../src/state/TitleContext';

const App = ({ Component, pageProps }: AppProps) => {
  const [currentTitle, setCurrentTitle] = useState('');
  const memoTitle = useMemo(
    () => ({ currentTitle, setCurrentTitle }),
    [currentTitle, setCurrentTitle]
  );

  return (
    <ThemeProvider defaultTheme='light'>
      <SharedHeader />
      <TitleContext.Provider value={memoTitle}>
        <Header />
        <Component {...pageProps} />
      </TitleContext.Provider>
      <Footer />
      <Analytics />
    </ThemeProvider>
  );
};

export default App;
