import cx from 'classnames';
import React from 'react';
import styles from '../../styles/components/UI/Heading.module.scss';

type HeadingTag = 'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  tag: HeadingTag;
}

type HeadingProxy = Record<HeadingTag, React.FC<Omit<HeadingProps, 'tag'>>>;

const Heading = React.forwardRef<Element, HeadingProps>((props, ref) => {
  const { children, id, tag, className } = props;

  const headingClassName = cx(
    styles.standard,
    styles[tag.toUpperCase()],
    className && className
  );

  return React.createElement(
    tag.toLocaleLowerCase(),
    { className: headingClassName, id, ref },
    children
  );
});

function createHeadingProxy(): HeadingProxy {
  const componentCache = new Map<string, React.FC<HeadingProps>>();

  return new Proxy({} as any, {
    get(_target, key: HeadingTag) {
      if (!componentCache.has(key)) {
        componentCache.set(
          key,
          React.forwardRef<Element, Omit<HeadingProps, 'tag'>>((props, ref) => (
            <Heading {...props} tag={key} ref={ref} />
          ))
        );
      }
      return componentCache.get(key);
    }
  });
}

export default createHeadingProxy();
