import React from 'react';
import { SmartLink } from '../src/components/article-helpers';
import { Main } from '../src/components/Layout';
import { Heading } from '../src/components/UI';

const FourOhFour = () => (
  <Main>
    <Heading.H1>404</Heading.H1>
    <Heading.H3>That page doesn&apos;t seem to exist</Heading.H3>
    <SmartLink href='/'>Back to home</SmartLink>
  </Main>
);

export default FourOhFour;
