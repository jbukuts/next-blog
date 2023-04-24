import { NextPage } from 'next';
import { ErrorProps } from 'next/error';
import React from 'react';
import { SmartLink } from '../src/components/article-helpers';
import { Main } from '../src/components/Layout';
import { Heading } from '../src/components/UI';

const ERROR_MESSAGES: Record<number, string> = {
  404: "That page doesn't seem to exist",
  500: 'There wan an internal error',
  0: 'Uh oh. Looks like something went wrong'
};

// eslint-disable-next-line react/prop-types
const Error: NextPage<ErrorProps> = ({ statusCode }) => (
  <Main>
    <Heading.H1>{statusCode}</Heading.H1>
    <Heading.H3>
      {statusCode in ERROR_MESSAGES
        ? ERROR_MESSAGES[statusCode]
        : ERROR_MESSAGES[0]}
    </Heading.H3>
    <SmartLink href='/'>Back to home</SmartLink>
  </Main>
);

Error.getInitialProps = ({ res, err }) => {
  const statusCode = (res && res.statusCode) || (err && err.statusCode) || 404;
  return { statusCode };
};

export default Error;
