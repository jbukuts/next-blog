import '../src/styles/globals.scss';

import type { AppProps } from 'next/app';
import React from 'react';
import Footer from '../src/components/Layout/Footer';
import Header from '../src/components/Layout/Header';
import { SharedHeader } from '../src/components/SEO';

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <SharedHeader />
    <Header />
    <Component {...pageProps} />
    <Footer />
  </>
);

export default App;
