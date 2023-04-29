import '@/styles/globals.scss';
import { Analytics } from '@vercel/analytics/react';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import React from 'react';
import { Footer, Header, SharedHeader } from '@/components/index';
import { TitleProvider } from 'src/state/TitleContext';

const App = ({ Component, pageProps }: AppProps) => (
  <ThemeProvider defaultTheme='dark'>
    <SharedHeader />
    <TitleProvider>
      <Header />
      <Component {...pageProps} />
    </TitleProvider>
    <Footer />
    <Analytics />
  </ThemeProvider>
);

export default App;
