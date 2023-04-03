import React from 'react';
import styles from '../../styles/components/ArticleHelpers/FlexContainer.module.scss';

interface FlexContainerProps {
  children: React.ReactNode;
}

const FlexContainer = (props: FlexContainerProps) => {
  const { children } = props;

  return <div className={styles.flexContainer}>{children}</div>;
};

export default FlexContainer;
