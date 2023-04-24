import { render } from '@testing-library/react';
import React from 'react';
import SideBar from './SideBar';

describe('SideBar', () => {
  it('can render element with props', () => {
    const className = 'test-class';
    const testText = 'This is a test';

    const { getByText, container } = render(
      <SideBar className={className} side='left'>
        <p>{testText}</p>
      </SideBar>
    );

    const text = getByText(testText);

    expect(text).toBeInTheDocument();
    expect(container.firstChild.classList.contains(className)).toBe(true);
    expect(container.firstChild.classList.contains('left')).toBe(true);
  });
});
