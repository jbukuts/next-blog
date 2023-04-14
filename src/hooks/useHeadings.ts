import { MutableRefObject, useEffect, useRef, useState } from 'react';

const useHeadings = () => {
  const [headings, setHeadings] = useState<Element[] | undefined>();
  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      const h = (ref.current as HTMLElement).querySelectorAll(
        'h1,h2,h3,h4,h5,h6'
      );
      setHeadings(Array.from(h));
    }
  }, [ref]);

  return [ref, headings] as [MutableRefObject<any>, Element[]];
};

export default useHeadings;
