import React from 'react';
import Main from '@/components/Layout/Main';

const NotFound = () => (
  <Main>
    <h2>Not Found</h2>
    <p>Could not find requested resource</p>
    <a href='/'>Return to home</a>
  </Main>
);

export default NotFound;
