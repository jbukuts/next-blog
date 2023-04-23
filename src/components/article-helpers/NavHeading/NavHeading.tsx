import cx from 'classnames';
import React from 'react';
import { Heading } from '../../UI';
import styles from './NavHeading.module.scss';

type HeadingTag = 'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6';

interface NavHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  tag: HeadingTag;
}

type NavHeadingProxy = Record<
  HeadingTag,
  React.FC<Omit<NavHeadingProps, 'tag'>>
>;

const NavHeading = (props: NavHeadingProps) => {
  const { tag, id, children } = props;

  return React.createElement(
    Heading[tag],
    { className: cx(tag !== 'H1' && styles.hoverEffect), id },
    children
  );
};

function createHeadingProxy(): NavHeadingProxy {
  const componentCache = new Map<string, React.FC<any>>();

  return new Proxy({} as any, {
    get(_target, key: HeadingTag) {
      if (!componentCache.has(key)) {
        componentCache.set(key, (props: Omit<NavHeadingProps, 'tag'>) => (
          <NavHeading {...props} tag={key} />
        ));
      }
      return componentCache.get(key);
    }
  });
}

export default createHeadingProxy();
