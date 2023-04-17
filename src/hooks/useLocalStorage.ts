import { useEffect, useState } from 'react';

const useLocalStorage = (key: string, defaultValue?: any) => {
  const [state, setState] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedValue = localStorage.getItem(key);

      try {
        if (storedValue !== null) return JSON.parse(storedValue);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    }
    return defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [state, key]);

  return [state, setState];
};

export default useLocalStorage;
