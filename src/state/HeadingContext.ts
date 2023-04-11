import React, { createContext } from 'react';

interface CurrentSection {
  id: string;
  text: string;
}

const HeadingContext = createContext({
  currentSection: { id: '', text: '' } as CurrentSection,
  setCurrentSection: (() => null) as React.Dispatch<
    React.SetStateAction<CurrentSection>
  >
});
export default HeadingContext;
