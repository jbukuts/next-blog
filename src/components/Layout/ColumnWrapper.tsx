import { GridItem } from '@chakra-ui/react';
import React from 'react';

export interface SideBarWrapperProps {
  children: React.ReactNode;
  side: 'left' | 'right' | 'center';
}

const sideProps = {
  left: {
    gridRow: 'content',
    gridColumn: 'left-side'
  },
  right: {
    gridRow: 'content',
    gridColumn: 'right-side'
  },
  center: {
    gridRow: 'content',
    gridColumn: 'middle'
  }
} as Record<SideBarWrapperProps['side'], object>;

const ColumnWrapper = (props: SideBarWrapperProps) => {
  const { children, side } = props;

  return <GridItem {...sideProps[side]}>{children}</GridItem>;
};

export default ColumnWrapper;
