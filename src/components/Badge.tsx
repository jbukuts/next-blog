import cx from 'classnames';
import React, { MouseEventHandler } from 'react';
import styles from '../styles/components/Badge.module.scss';

interface TagBadgeProps {
  children: React.ReactNode;
  emoji?: string;
  size?: 'sm' | 'md';
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const TagBadge = (props: TagBadgeProps) => {
  const { children, size, emoji, onClick } = props;

  const tagProps = {
    className: cx(
      styles.badge,
      styles[size as string],
      onClick && styles.buttonBadge
    ),
    ...(onClick && { onClick })
  };

  return React.createElement(
    onClick ? 'button' : 'div',
    tagProps,
    <>
      {children}
      {emoji && ` ${emoji}`}
    </>
  );
};

TagBadge.defaultProps = {
  emoji: undefined,
  size: 'md',
  onClick: undefined
};

export default TagBadge;
