import cx from 'classnames';
import React from 'react';
import styles from './Stack.module.scss';

interface StackProps extends React.HTMLAttributes<Element> {
  as?: string | React.FC<any>;
  type?: 'horizontal' | 'vertical';
  spacing?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'none';
  reverse?: boolean;
  responsive?: boolean;
  [asProp: string]: any;
}

const Stack = React.forwardRef<Element, StackProps>((props, ref) => {
  const {
    as = 'div',
    className,
    children,
    type = 'horizontal',
    spacing = 'sm',
    reverse = false,
    responsive = false,
    ...rest
  } = props;

  const stackClassName = cx(
    styles.stackShare,
    styles[type],
    reverse && styles.reverse,
    responsive && styles.responsive,
    styles[`spacing-${spacing}`],
    className && className
  );

  return React.createElement(
    as,
    { ...rest, ref, className: stackClassName },
    children
  );
});

export default Stack;
