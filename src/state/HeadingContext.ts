import React, { createContext } from 'react';

const HeadingContext = createContext({
  currentSection: '' as string,
  setCurrentSection: (() => {}) as React.Dispatch<React.SetStateAction<string>>
});
export default HeadingContext;
