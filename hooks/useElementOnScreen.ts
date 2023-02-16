import { useEffect, useRef, useState } from 'react';

export interface IntersectionObserverOptions {
  root?: any;
  rootMargin?: string;
  threshold?: number | number[];
}

const useElementOnScreen = (options: IntersectionObserverOptions | void) => {
  const containerRef = useRef(null);
  const [visible, setVisible] = useState();

  const callbackFunction = (entries: any[]) => {
    const [entry] = entries;
    setVisible(entry.isIntersecting);
  };

  useEffect(() => {
    const container = containerRef.current;

    const observer = new IntersectionObserver(callbackFunction, {
      threshold: 0,
      ...options
    } as IntersectionObserverOptions);

    if (container) observer.observe(container);

    return () => {
      if (container) observer.unobserve(container);
    };
  }, [options, containerRef]);

  return [containerRef, visible];
};

export default useElementOnScreen;
