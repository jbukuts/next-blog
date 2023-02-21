import { Heading, HeadingProps } from '@chakra-ui/react';
import React, { useContext, useEffect } from 'react';
import HeadingContext from '../../state/HeadingContext';
import { useElementOnScreen } from '../hooks';

interface CustomHeadingProps {
  id: string;
  children: React.ReactNode;
}

const propsByTag: Record<string, HeadingProps> = {
  h1: { size: '2xl', mb: 6 },
  h2: { size: 'xl', mb: 4 },
  h3: { size: 'lg', mb: 3 }
};

function createHeadingProxy() {
  const customHead = (key: string) =>
    function CustomHeading(props: CustomHeadingProps) {
      const { children, id } = props;

      const [headingRef, visible] = useElementOnScreen({
        rootMargin: '0px 0px -98% 0px'
      });

      const { setCurrentSection } = useContext(HeadingContext);

      useEffect(() => {
        if (visible && id && headingRef?.current) setCurrentSection(id);
      }, [visible, id, setCurrentSection, headingRef]);

      return (
        <Heading
          {...(key === 'H1' && { itemProp: 'name headline' })}
          _hover={{ _after: { content: '"🔗"', ml: 2 } }}
          scrollMarginTop={2}
          as={key.toLowerCase() as any}
          ref={headingRef}
          id={id}
          {...propsByTag[key.toLowerCase()]}>
          {children}
        </Heading>
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