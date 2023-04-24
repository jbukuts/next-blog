import { render, screen } from '@testing-library/react';
import React from 'react';
import ErrorPage from '../../pages/_error';

describe('ErrorPage', () => {
  it('can render page with standard error code', () => {
    render(<ErrorPage statusCode={404} />);

    const title = screen.getByText("That page doesn't seem to exist");
    expect(title).toBeInTheDocument();
  });

  it('can render page with non-existent error code', () => {
    render(<ErrorPage statusCode={777} />);

    const title = screen.getByText('Uh oh. Looks like something went wrong');
    expect(title).toBeInTheDocument();
  });

  describe('getInitialProps', () => {
    const context = {
      pathname: '/error',
      query: {},
      AppTree: () => null
    };

    it('can run with error code', async () => {
      const props = ErrorPage.getInitialProps({
        ...context,
        err: { name: 'Internal Error', message: 'Uh oh', statusCode: 500 }
      });

      expect(props).toEqual({ statusCode: 500 });
    });

    it('can run with status code', async () => {
      const props = ErrorPage.getInitialProps({
        ...context,
        res: { statusCode: 401 }
      });

      expect(props).toEqual({ statusCode: 401 });
    });

    it('can run with nothing', async () => {
      const props = ErrorPage.getInitialProps({});

      expect(props).toEqual({ statusCode: 404 });
    });
  });
});
