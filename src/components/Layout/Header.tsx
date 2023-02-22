import { GridItem } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Header = () => (
  <GridItem
    as='header'
    gridRow='header'
    gridColumn='middle'
    display='flex'
    justifyContent={['center', 'left']}
    mt={8}
    mb={6}
    title='Back to home'>
    <Link href='/'>
      <Image
        style={{ imageRendering: 'crisp-edges' }}
        priority
        width={200}
        height={83}
        alt='Bukut Blog'
        src='/name-chrome.webp'
      />
    </Link>
  </GridItem>
);

export default Header;
