import React from 'react';
import styles from '../../styles/components/ArticleHelpers/FlexContainer.module.scss';
import { Stack } from '../Layout';

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
