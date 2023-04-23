import cx from 'classnames';
import React, { ForwardedRef } from 'react';
import styles from './Main.module.scss';

interface MainProps {
  children?: React.ReactNode;
  className?: string;
}

const Main = (props: MainProps, ref: ForwardedRef<any>) => {
  const { children, className, ...rest } = props;
  const mainClass = cx(styles.mainContent, className && className);

  return (
    <main {...rest} className={mainClass} ref={ref}>
      {children}
    </main>
  );
};

export default React.forwardRef(Main);
