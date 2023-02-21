import { Box, HTMLChakraProps } from '@chakra-ui/react';
import React from 'react';

interface WindowProps {
  title?: string;
  children: React.ReactNode;
  as?: any;
  asProps?: HTMLChakraProps<any>;
  topBar?: boolean;
  contentProps?: HTMLChakraProps<any>;
}

const BarButton = ({ bg }: { bg: string }) => (
  <Box
    height={3}
    width={3}
    borderRadius='full'
    bg={bg}
    border='1px solid rgba(0, 0, 0, 0.25)'
  />
);

const Window = React.forwardRef((props: WindowProps, ref: any) => {
  const { title, children, as, asProps, topBar, contentProps } = props;

  return (
    <Box
      as={as}
      ref={ref}
      borderWidth='1px'
      borderColor='brand.outline'
      overflow='hidden'
      borderRadius='lg'
      bg='white'
      boxShadow='0px 10px 15px rgba(0, 0, 0, 0.25)'
      {...asProps}>
      {topBar && (
        <Box
          position='relative'
          display='flex'
          alignItems='center'
          justifyContent='center'
          textAlign='center'
          width='full'
          height='auto'
          padding={1}
          fontSize='sm'
          bg='brand.barColor'
          _after={{
            content: '""',
            width: '100%',
            height: '100%',
            display: 'block',
            position: 'absolute',
            left: '0',
            top: '0',
            pointerEvents: 'none',
            bg: 'brand.gradientOverlay'
          }}
          borderBottomWidth='1px'
          borderColor='brand.outline'>
          <Box display='flex' position='absolute' left={2.5} gap={1}>
            <BarButton bg='brand.close' />
            <BarButton bg='brand.minimize' />
            <BarButton bg='brand.maximize' />
          </Box>
          {title || ''}
        </Box>
      )}
      <Box {...contentProps}>{children}</Box>
    </Box>
  );
});

Window.defaultProps = {
  title: undefined,
  as: 'div',
  asProps: {},
  topBar: true,
  contentProps: { p: 5 }
};

export default Window;
