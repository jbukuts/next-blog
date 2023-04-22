import React from 'react';
import { Main } from '../src/components/Layout';
import Heading from '../src/components/UI/Heading';

const TestPage = () => (
  <Main>
    <Heading.H1>This is an H1 tag</Heading.H1>
    <Heading.H2>This is an H2 tag</Heading.H2>
    <Heading.H3>This is an H3 tag</Heading.H3>
    <Heading.H4>This is an H4 tag</Heading.H4>
  </Main>
);

export default TestPage;
