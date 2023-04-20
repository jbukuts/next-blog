import { MutableRefObject, useEffect, useRef, useState } from 'react';

const useCurrentHeading = (): [MutableRefObject<HTMLElement>, string] => {
  const docRef = useRef<HTMLElement>(null);
  const [currHeading, setCurrHeading] = useState<string>('');

  useEffect(() => {
    const callback = (entries: IntersectionObserverEntry[]) => {
      const visibleEntries = entries.filter((e) => e.isIntersecting);
      if (visibleEntries.length > 0)
        setCurrHeading(visibleEntries[0].target.id);
    };

    const headings = docRef.current?.querySelectorAll('h1,h2,h3,h4,h5');
    const observer = new IntersectionObserver(callback, {
      rootMargin: '-60px 0px -50% 0px'
    });

    headings?.forEach((element) => observer.observe(element));

    return () => headings?.forEach((element) => observer.unobserve(element));
  }, [docRef]);

  return [docRef, currHeading] as [MutableRefObject<HTMLElement>, string];
};

export default useCurrentHeading;
