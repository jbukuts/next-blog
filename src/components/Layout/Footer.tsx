import { Heading, Link, VStack } from '@chakra-ui/react';
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
    <video
      onContextMenu={(event) => event.preventDefault()}
      autoPlay
      loop
      muted
      style={{
        userSelect: 'none',
        objectFit: 'cover',
        position: 'absolute',
        width: '100%',
        left: '0',
        top: '0'
      }}>
      <source src='/images/gits.mp4' type='video/mp4' />
    </video>
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
