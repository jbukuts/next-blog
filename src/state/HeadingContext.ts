import React, { createContext } from 'react';

interface CurrentSection {
  id: string;
  text: string;
}

const HeadingContext = createContext([{ id: '', text: '' }, () => null] as [
  CurrentSection,
  React.Dispatch<React.SetStateAction<CurrentSection>>
]);

export default HeadingContext;
