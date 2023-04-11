import NextLink from 'next/link';
import React from 'react';

interface SmartLinkProps {
  href: string;
  children: React.ReactNode;
}

const SmartLink = (props: SmartLinkProps) => {
  const { href, children } = props;

  const isExternal =
    href.startsWith('http') ||
    href.startsWith('//') ||
    href.startsWith('mailto:');
  const isHash = href.startsWith('#');

  const linkProps = {
    href,
    ...((isExternal && { target: '_blank', rel: 'noreferrer' }) || {
      ...((isHash && { replace: true }) || {})
    })
  };

  return React.createElement(isExternal ? 'a' : NextLink, linkProps, children);
};

export default SmartLink;
