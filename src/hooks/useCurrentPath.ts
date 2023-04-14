import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const useCurrentPath = () => {
  const router = useRouter();
  const [currPath, setCurrPath] = useState('');

  useEffect(() => {
    setCurrPath(() => {
      const isWindow = typeof window !== 'undefined';
      if (isWindow && window.location) return window.location.pathname;

      const { query, pathname } = router;
      return Object.keys(query).reduce(
        (acc, curr) => acc.replace(`[${curr}]`, query[curr] as string),
        pathname
      );
    });
  }, [router]);

  return currPath;
};

export default useCurrentPath;
