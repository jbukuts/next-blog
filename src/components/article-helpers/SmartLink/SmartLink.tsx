import NextLink from 'next/link';
import React from 'react';
import HashLink from './HashLink';
import styles from './SmartLink.module.scss';

interface SmartLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

const SmartLink = (props: SmartLinkProps) => {
  const { href, children, className, ...rest } = props;

  const isExternal =
    href.startsWith('http') ||
    href.startsWith('//') ||
    href.startsWith('mailto:');
  const isHash = href.startsWith('#');

  const linkProps = {
    href,
    ...rest,
    ...((isExternal && { target: '_blank', rel: 'noreferrer' }) || {}),
    className: className || styles.link
  };

  if (isHash) return <HashLink {...props} />;

  return React.createElement(isExternal ? 'a' : NextLink, linkProps, children);
};

export default SmartLink;
