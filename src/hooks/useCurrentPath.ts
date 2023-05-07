'use client';

import {
  ReadonlyURLSearchParams,
  usePathname,
  useSearchParams
} from 'next/navigation';
import { useEffect, useState } from 'react';

const useCurrentPath = () => {
  const pathName = usePathname();
  const query = useSearchParams();
  const [currPath, setCurrPath] = useState('');

  useEffect(() => {
    setCurrPath(() => {
      const isWindow = typeof window !== 'undefined';
      if (isWindow && window.location) return window.location.pathname;

      return Array.from((query as ReadonlyURLSearchParams).keys()).reduce(
        (acc, curr) => acc.replace(`[${curr}]`, query?.get(curr) as string),
        pathName as string
      );
    });
  }, [pathName, query]);

  return currPath;
};

export default useCurrentPath;
