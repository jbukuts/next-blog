import { render } from '@testing-library/react';
import React from 'react';
import Main from './Main';

describe('Main', () => {
  it('can render element properly', () => {
    const className = 'test-class';
    const testText = 'This is a test';

    const { getByText, container } = render(
      <Main className={className}>
        <p>{testText}</p>
      </Main>
    );

    const text = getByText(testText);
    expect(text).toBeInTheDocument();

    expect(container.firstChild.classList.contains(className)).toBe(true);
  });
});
