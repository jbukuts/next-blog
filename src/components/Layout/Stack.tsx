import cx from 'classnames';
import React, { ForwardedRef } from 'react';
import styles from '../../styles/components/Layout/Stack.module.scss';

interface StackProps {
  as?: string | any;
  type?: 'horizontal' | 'vertical';
  className?: string;
  children?: React.ReactNode;
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'none';
  reverse?: boolean;
  [asProp: string]: any;
}

const Stack = (props: StackProps, ref: ForwardedRef<any>) => {
  const {
    as = 'div',
    className,
    children,
    type = 'horizontal',
    spacing = 'sm',
    reverse = false,
    ...rest
  } = props;

  const stackClassName = cx(
    styles.stackShare,
    styles[type],
    reverse && styles.reverse,
    styles[`spacing-${spacing}`],
    className && className
  );

  return React.createElement(
    as,
    { ...rest, ref, className: stackClassName },
    children
  );
};

export default React.forwardRef(Stack);
