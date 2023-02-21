import { Box, Button } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';

interface PrettyCodeProps {
  copyButton?: boolean;
  children: React.ReactNode;
}

const PrettyCode: React.FC<PrettyCodeProps> = (props) => {
  const { children, copyButton } = props;
  const codeRef = useRef(null);
  const [clicked, setClicked] = useState(false);

  const onCopyClick = () => {
    const { current } = codeRef;
    if (!current) return;
    const text = (current as Element).querySelector('pre');
    navigator.clipboard.writeText(text?.textContent || '');
    setClicked(true);
  };

  return (
    <Box ref={codeRef} pos='relative' mb={6}>
      {children}
      {copyButton && (
        <Button
          colorScheme='whiteAlpha'
          size='sm'
          m={4}
          position='absolute'
          bottom={0}
          right={0}
          onClick={onCopyClick}
          variant={(clicked && 'solid') || 'outline'}>
          {clicked ? 'Copied' : 'Copy'}
        </Button>
      )}
    </Box>
  );
};

PrettyCode.defaultProps = {
  copyButton: true
};

export default PrettyCode;
