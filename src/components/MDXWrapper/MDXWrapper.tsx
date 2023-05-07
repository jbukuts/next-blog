'use client';

import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote';
import React from 'react';
import { Heading } from '../UI';

const standardComponents: MDXRemoteProps['components'] = {
  FlexContainer: React.Fragment,
  h1: Heading.H1,
  h2: Heading.H2,
  h3: Heading.H3,
  a: 'u'
} as any;

const MDXWrapper = ({ components, ...rest }: any) => (
  <MDXRemote components={{ ...standardComponents, ...components }} {...rest} />
);

export default MDXWrapper;
