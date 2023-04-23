import cx from 'classnames';
import React, { MouseEventHandler } from 'react';
import styles from './Badge.module.scss';

interface TagBadgeProps {
  children: React.ReactNode;
  size?: 'sm' | 'md';
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const TagBadge = (props: TagBadgeProps) => {
  const { children, size = 'md', onClick } = props;

  const tagProps = {
    className: cx(
      styles.badge,
      styles[size as string],
      onClick && styles.buttonBadge
    ),
    ...(onClick && { onClick })
  };

  return React.createElement(onClick ? 'button' : 'div', tagProps, children);
};

export default TagBadge;
