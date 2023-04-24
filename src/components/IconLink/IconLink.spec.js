import { render } from '@testing-library/react';
import React from 'react';
import { TbMail as TestIcon } from 'react-icons/tb';
import IconLink from './IconLink';

describe('IconLink', () => {
  it('can render element properly', () => {
    const { queryByTitle } = render(
      <IconLink
        size={32}
        href='https://example.com'
        icon={TestIcon}
        title='test'
      />
    );

    const link = queryByTitle('test');
    expect(link).toBeInTheDocument();
  });

  it('can render element when fill is passed', () => {
    const { queryByTitle } = render(
      <IconLink
        size={32}
        href='https://example.com'
        icon={TestIcon}
        title='test'
        fill
      />
    );

    const link = queryByTitle('test');
    expect(link).toBeInTheDocument();
  });
});
