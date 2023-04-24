import { render } from '@testing-library/react';
import React from 'react';
import Footer from './Footer';

describe('Footer', () => {
  it('can render element properly', () => {
    const { getByText } = render(<Footer />);

    const text = getByText("It's me again");
    expect(text).toBeInTheDocument();
  });
});
