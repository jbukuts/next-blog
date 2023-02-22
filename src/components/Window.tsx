import cx from 'classnames';
import React from 'react';
import styles from './Window.module.scss';

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
  const { title, children, as, asProps, topBar, className, contentClassName } =
    props;

  const child = (
    <>
      {topBar && (
        <div className={styles.topBar}>
          <div className={styles.buttonContainer}>
            <div />
            <div />
            <div />
          </div>
          {title || ''}
        </div>
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

Window.defaultProps = {
  title: undefined,
  as: 'div',
  asProps: {},
  topBar: true,
  className: undefined,
  contentClassName: undefined
};

export default Window;
