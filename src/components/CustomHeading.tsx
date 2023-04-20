import cx from 'classnames';
import React, { useContext, useEffect } from 'react';
import { useElementOnScreen } from '../hooks';
import HeadingContext from '../state/HeadingContext';
import styles from '../styles/components/CustomHeading.module.scss';

interface CustomHeadingProps {
  id: string;
  children: React.ReactNode;
}

const HEADER_HEIGHT = styles.headerHeight;

function createHeadingProxy() {
  const createCustomHeading = (key: string) =>
    function CustomHeading(props: CustomHeadingProps) {
      const { children, id } = props;

      const [headingRef, visible] = useElementOnScreen({
        rootMargin: `-${HEADER_HEIGHT} 0px -40% 0px`
      });

      const [_, setCurrentSection] = useContext(HeadingContext);

      useEffect(() => {
        if (visible && id && headingRef?.current) {
          setCurrentSection((currentSection) => {
            if (currentSection.id === id) return currentSection;

            return {
              id,
              text: headingRef.current?.innerText || ''
            };
          });
        }
      }, [visible, setCurrentSection, id, headingRef]);

      const headingClassName = cx(key !== 'H1' && styles.standard, styles[key]);

      return React.createElement(
        key.toLowerCase(),
        { className: headingClassName, id, ref: headingRef },
        children
      );
    };

  const componentCache = new Map<string, React.FC<any>>();

  return new Proxy({} as any, {
    get(_target, key: string) {
      if (!componentCache.has(key)) {
        componentCache.set(key, createCustomHeading(key));
      }
      return componentCache.get(key);
    }
  });
}

const EveryHeading = createHeadingProxy();
export default EveryHeading;
