import { useEffect, useState } from 'react';
import throttle from '../helpers/throttle';

const useScrollPercentage = (threshold?: number) => {
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const onScroll = throttle(() => {
      const h = document.documentElement;
      const b = document.body;
      const st = 'scrollTop';
      const sh = 'scrollHeight';

      setScrollPercent((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight));
    }, threshold || 100);

    document.addEventListener('scroll', onScroll);

    return () => document.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrollPercent;
};

export default useScrollPercentage;
