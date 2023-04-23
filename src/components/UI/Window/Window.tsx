import cx from 'classnames';
import React from 'react';
import Stack from '../Stack/Stack';
import styles from './Window.module.scss';

interface WindowProps {
  title?: string;
  children: React.ReactNode;
  as?: string | React.ComponentType | React.ElementType;
  asProps?: any;
  topBar?: boolean;
  className?: string;
  contentClassName?: string;
}

const Window = React.forwardRef<Element, WindowProps>((props, ref) => {
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
      <div className={contentClassName}>{children}</div>
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
