import { tagAnatomy } from '@chakra-ui/anatomy';
import {
  createMultiStyleConfigHelpers,
  extendBaseTheme
} from '@chakra-ui/react';
import chakraTheme from '@chakra-ui/theme';

const { Button, Heading, Link, List, Tag } = chakraTheme.components;

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tagAnatomy.keys);

// 'linear-gradient(0deg, rgb(189, 189, 189) 0%, rgb(234, 234, 234) 100%)'
const brand = {
  barColor: 'rgb(235, 235, 235)',
  gradientOverlay:
    'linear-gradient(0deg, rgba(0,0,0,.15) 0%, rgba(0,0,0,.05) 100%)',
  outline: 'rgb(149, 149, 149)',
  close: 'rgb(248, 92, 90)',
  minimize: 'rgb(247, 193, 51)',
  maximize: 'rgb(25, 205, 68)'
};

const gray = {
  900: '#242424',
  500: '#8c8c8c',
  400: '#c7c7c7',
  300: '#b0b0b0',
  200: '#d6d6d6',
  100: '#f2f2f2'
};

const baseTagStyle = definePartsStyle({
  container: {
    borderRadius: 'md',
    userSelect: 'none',
    position: 'relative',
    overflow: 'hidden',
    _after: {
      content: '""',
      width: '100%',
      height: '100%',
      display: 'block',
      position: 'absolute',
      left: '0',
      top: '0',
      pointerEvents: 'none',
      bg: 'brand.gradientOverlay',
      mixBlendMode: 'multiply'
    }
  }
});

const tagTheme = defineMultiStyleConfig({ baseStyle: baseTagStyle });

const theme = extendBaseTheme({
  styles: {
    global: () => ({
      body: {
        margin: '0',
        padding: '0 1rem',
        scrollBehavior: 'smooth',
        width: '100%'
        // overflow: 'overlay'
      },
      html: {
        margin: '0',
        padding: '0',
        fontFamily:
          'San Francisco, Apple Color Emoji, -apple-system, sans-serif',
        scrollBehavior: 'smooth',
        width: '100%'
      },
      code: {
        fontStyle: 'italic',
        px: 1.5,
        py: 0.5,
        borderRadius: 'md',
        color: 'gray.900',
        bg: 'gray.100',
        borderWidth: '1px',
        fontSize: '.85rem'
      },
      pre: {
        code: {
          fontStyle: 'normal',
          overflowX: 'auto',
          p: 4,
          display: 'grid',
          bg: '#1e1e1e',
          borderColor: 'brand.outline'
        }
      }
    })
  },
  colors: {
    brand,
    gray
  },
  components: {
    Tag: { ...Tag, ...tagTheme },
    Button,
    Heading,
    Link,
    List
  },
  fonts: {
    body: 'San Francisco, Apple Color Emoji',
    heading: 'San Francisco, Apple Color Emoji'
  }
});

export default theme;