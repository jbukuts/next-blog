import '../styles/globals.scss';

import type { AppProps } from 'next/app';
import React from 'react';
import Footer from '../src/components/Layout/Footer';
import Header from '../src/components/Layout/Header';

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <Header />
    <Component {...pageProps} />
    <Footer />
  </>
);

export default App;
