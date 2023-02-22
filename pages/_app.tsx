import '../styles/globals.scss';
import { Grid } from '@chakra-ui/layout';
import { ChakraProvider } from '@chakra-ui/provider';

import type { AppProps } from 'next/app';
import React from 'react';
import Footer from '../src/components/Layout/Footer';
import Header from '../src/components/Layout/Header';

import theme from '../theme';

const App = ({ Component, pageProps }: AppProps) => (
  <ChakraProvider theme={theme}>
    <Grid
      m={0}
      justifyContent='center'
      gap={5}
      templateRows='[header] auto [content] auto [footer] auto'
      templateColumns='[left-side] 250px [middle] min(100%, 700px)
    [right-side] 250px'>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </Grid>
  </ChakraProvider>
);

export default App;
