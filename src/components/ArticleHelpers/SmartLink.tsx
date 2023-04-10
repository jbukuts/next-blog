import NextLink from 'next/link';
import React from 'react';

interface SmartLinkProps {
  href: string;
  children: React.ReactNode;
}

const SmartLink = (props: SmartLinkProps) => {
  const { href, children } = props;

  const isExternal = href.startsWith('http') || href.startsWith('//');
  if (isExternal) return <a href={href}>{children}</a>;

  const isHash = href.startsWith('#');

  const nextLinkProps = {
    href,
    ...((isHash && { replace: true }) || {})
  };

  return <NextLink {...nextLinkProps}>{children}</NextLink>;
};

export default SmartLink;
