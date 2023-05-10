import React from 'react';
import Main from '@/components/Layout/Main';
import { Heading, Stack } from '@/components/UI';
import styles from '@/styles/pages/not-found.module.scss';

const NotFound = () => (
  <Main>
    <Stack className={styles.mainWrapper} type='vertical'>
      <Heading.H1>Not Found</Heading.H1>
      <p>Could not find requested resource</p>
      <a href='/'>Return to home</a>
    </Stack>
  </Main>
);

export default NotFound;
