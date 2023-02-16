import cx from 'classnames';
import React from 'react';
import styles from './Window.module.scss';

interface WindowProps {
  title?: string;
  wrapper?: string | React.FC<any>;
  wrapperOptions?: object;
  hoverable?: boolean;
  className?: string;
  children: React.ReactNode;
}

const Window = React.forwardRef((props: WindowProps, ref: any) => {
  const {
    title,
    wrapper = 'div',
    wrapperOptions,
    hoverable,
    children,
    className
  } = props;

  return React.createElement(
    wrapper,
    {
      className: cx(
        styles.container,
        className,
        hoverable && styles.containerHover
      ),
      ref,
      ...wrapperOptions
    },
    <>
      <div className={styles.topBar}>
        <div className={styles.buttons}>
          <div />
          <div />
          <div />
        </div>
        <p>{title}</p>
      </div>
      {children}
    </>
  );
});

Window.defaultProps = {
  title: undefined,
  wrapper: 'div',
  wrapperOptions: {},
  hoverable: false,
  className: undefined
};

export default Window;
