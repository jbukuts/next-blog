import cx from 'classnames';
import React from 'react';
import styles from './Badge.module.scss';

interface TagBadgeProps {
  children: React.ReactNode;
  emoji?: string;
  size?: 'sm' | 'md';
}

const TagBadge = (props: TagBadgeProps) => {
  const { children, size, emoji } = props;

  return (
    <div className={cx(styles.badge, styles[size as string])}>
      {children}
      {emoji && ` ${emoji}`}
    </div>
  );
};

TagBadge.defaultProps = {
  emoji: undefined,
  size: 'md'
};

export default TagBadge;
