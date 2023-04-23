import React from 'react';
import { Stack } from '../../UI';
import styles from './FlexContainer.module.scss';

interface FlexContainerProps {
  children: React.ReactNode;
}

const FlexContainer = (props: FlexContainerProps) => {
  const { children } = props;

  return (
    <Stack spacing='xl' className={styles.flexContainer}>
      {children}
    </Stack>
  );
};

export default FlexContainer;
