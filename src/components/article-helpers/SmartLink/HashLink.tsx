'use client';

import React, { AnchorHTMLAttributes, DetailedHTMLProps } from 'react';
import styles from './SmartLink.module.scss';

type SmartLinkProps = DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

const HashLink = (props: SmartLinkProps) => {
  const { href, children, className } = props;

  const navigateHash: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    const { href: to = '#' } = (e.target as Element).closest('a') || {};
    window.location.replace(to);
  };

  return (
    <a href={href} onClick={navigateHash} className={className || styles.link}>
      {children}
    </a>
  );
};

export default HashLink;
