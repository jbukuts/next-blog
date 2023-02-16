import React, { useContext, useEffect } from 'react';
import { useElementOnScreen } from '../../hooks';
import HeadingContext from '../../state/HeadingContext';
import styles from './CustomHeading.module.scss';

interface CustomHeadingProps {
  id: string;
  children: React.ReactNode;
}

function createHeadingProxy() {
  const customHead = (key: string) =>
    function CustomHeading(props: CustomHeadingProps) {
      const { children, ...rest } = props;

      const [headingRef, visible] = useElementOnScreen({
        rootMargin: '0px 0px -98% 0px'
      });

      const { setCurrentSection } = useContext(HeadingContext);

      useEffect(() => {
        if (visible && rest.id && headingRef?.current)
          setCurrentSection(rest.id);
      }, [visible, rest.id, setCurrentSection, headingRef]);

      return React.createElement(
        key.toLowerCase(),
        { ...rest, ref: headingRef, className: styles[key.toLowerCase()] },
        children
      );
    };

  const componentCache = new Map<string, React.FC<any>>();

  return new Proxy({} as any, {
    get(_target, key: string) {
      if (!componentCache.has(key)) {
        componentCache.set(key, customHead(key));
      }
      return componentCache.get(key);
    }
  });
}

const EveryHeading = createHeadingProxy();
export default EveryHeading;
