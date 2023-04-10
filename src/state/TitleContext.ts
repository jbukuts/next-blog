import React, { createContext } from 'react';

const TitleContext = createContext({
  currentTitle: '' as string,
  setCurrentTitle: (() => null) as React.Dispatch<React.SetStateAction<string>>
});
export default TitleContext;
