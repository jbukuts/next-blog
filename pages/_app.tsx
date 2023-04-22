import '../src/styles/globals.scss';
import { Analytics } from '@vercel/analytics/react';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import React from 'react';
// import { BottomCard } from '../src/components';
import { Footer, Header } from '../src/components/Layout';
import { SharedHeader } from '../src/components/SEO';
import { TitleProvider } from '../src/state/TitleContext';

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
