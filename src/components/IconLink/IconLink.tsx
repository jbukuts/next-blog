import React from 'react';
import { IconType } from 'react-icons/lib';
import styles from './IconLink.module.scss';

interface IconLinkProps extends React.HTMLAttributes<HTMLLinkElement> {
  href: string;
  icon: IconType;
  size?: number;
  fill?: boolean;
}

const IconLink = (props: IconLinkProps) => {
  const { href, icon: Icon, size = 24, title, fill = false } = props;
  return (
    <a
      style={{ height: `${size}px` }}
      target='_blank'
      href={href}
      rel='noreferrer'
      className={styles.iconLink}
      title={title}>
      <Icon size={size} {...(fill && { fill: 'currentColor' })} />
    </a>
  );
};

export default IconLink;
