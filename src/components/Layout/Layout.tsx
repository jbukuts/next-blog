import { Grid } from '@chakra-ui/react';
import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = (props: LayoutProps) => {
  const { children } = props;

  <Grid
    m={0}
    justifyContent='center'
    gap={5}
    templateRows='[header] auto [content] auto [footer] auto'
    templateColumns='[left-side] 250px [middle] min(100%, 700px)
    [right-side] 250px'>
    <Header />
    {children}
    <footer />
  </Grid>;
};

export default Layout;
