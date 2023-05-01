'use client';

import React, { createContext, useState } from 'react';

interface TitleProviderProps {
  children: React.ReactNode;
}

type TitleContextType = [string, React.Dispatch<React.SetStateAction<string>>];

const TitleContext = createContext<TitleContextType>(['', () => null]);

const TitleProvider = (props: TitleProviderProps) => {
  const { children } = props;

  const titleState = useState<string>('');

  return React.createElement(
    TitleContext.Provider,
    { value: titleState },
    children
  );
};

export { TitleProvider };
export default TitleContext;
