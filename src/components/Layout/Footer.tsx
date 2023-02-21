import { Heading, Link, VStack } from '@chakra-ui/react';
import Image from 'next/image';
import React from 'react';
import Window from '../Window';

const Footer = () => (
  <Window
    topBar={false}
    as='footer'
    asProps={{
      gridRow: 'footer',
      gridColumn: 'middle',
      height: '10rem',
      mb: 5,
      mt: 2
    }}
    contentProps={{
      display: 'flex',
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%'
    }}>
    <Image
      style={{
        imageRendering: 'pixelated',
        position: 'absolute',
        top: '0',
        left: '0',
        userSelect: 'none',
        aspectRatio: '500 / 332',
        objectFit: 'cover'
      }}
      src='/gits.gif'
      alt='Footer image'
      loading='lazy'
      fill
    />
    <VStack zIndex={1} padding={4} borderRadius='lg' color='white'>
      <Heading as='h1' size={['lg', 'xl']}>
        🤩 Thanks for reading 🤩
      </Heading>
      <Heading as='h2' size='md'>
        Site code available{' '}
        <Link
          target='_blank'
          textDecoration='underline'
          href='https://github.com/jbukuts/next-blog'>
          here
        </Link>
      </Heading>
    </VStack>
  </Window>
);

export default Footer;
