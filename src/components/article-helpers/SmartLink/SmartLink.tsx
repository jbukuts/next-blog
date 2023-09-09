import NextLink from 'next/link';
import React, { AnchorHTMLAttributes, DetailedHTMLProps } from 'react';
import HashLink from './HashLink';
import styles from './SmartLink.module.scss';

type SmartLinkProps = DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

const SmartLink: React.FunctionComponent<SmartLinkProps> = (props) => {
  const { href, children, className, ...rest } = props;

  const isExternal =
    href?.startsWith('http') ||
    href?.startsWith('//') ||
    href?.startsWith('mailto:');
  const isHash = href?.startsWith('#');

  const linkProps = {
    href: href as any,
    ...rest,
    ...((isExternal && { target: '_blank', rel: 'noreferrer' }) || {}),
    className: className || styles.link
  };

  if (isHash) return <HashLink {...props} />;

  return React.createElement(
    isExternal ? 'a' : NextLink,
    linkProps as any,
    children
  );
};

export default SmartLink;
