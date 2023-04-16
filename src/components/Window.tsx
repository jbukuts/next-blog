import cx from 'classnames';
import React from 'react';
import styles from '../styles/components/Window.module.scss';
import Stack from './Layout/Stack';

interface WindowProps {
  title?: string;
  children: React.ReactNode;
  as?: any;
  asProps?: any;
  topBar?: boolean;
  className?: string;
  contentClassName?: string;
}

const Window = React.forwardRef((props: WindowProps, ref: any) => {
  const {
    title,
    children,
    as = 'div',
    asProps = {},
    topBar = true,
    className,
    contentClassName
  } = props;

  const child = (
    <>
      {topBar && (
        <Stack className={styles.topBar} aria-hidden='true'>
          <Stack spacing='xs' className={styles.buttonContainer}>
            <div />
            <div />
            <div />
          </Stack>
          {title || ''}
        </Stack>
      )}
      <div className={cx(styles.windowContent, contentClassName)}>
        {children}
      </div>
    </>
  );

  return React.createElement(
    as,
    {
      ...asProps,
      className: cx(className, styles.windowWrapper),
      ref
    },
    child
  );
});

export default Window;
