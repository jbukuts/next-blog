import { render } from '@testing-library/react';
import React from 'react';
import Header from './Header';

jest.mock('next/router', () => ({
  ...jest.requireActual('next/router'),
  useRouter: jest.fn()
}));

window.IntersectionObserver = jest.fn(() => ({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
}));

describe('Header', () => {
  it('can render element properly', () => {
    const { queryByRole } = render(<Header />);

    const header = queryByRole('banner');
    expect(header).toBeInTheDocument();
  });
});
