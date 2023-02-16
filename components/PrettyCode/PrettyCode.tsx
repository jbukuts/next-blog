import React, { useRef, useState } from 'react';
import styles from './PrettyCode.module.scss';

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
    <div className={styles.prettyCode} ref={codeRef}>
      {children}
      {copyButton && (
        <button onClick={onCopyClick} type='button'>
          {clicked ? 'Copied' : 'Copy'}
        </button>
      )}
    </div>
  );
};

PrettyCode.defaultProps = {
  copyButton: true
};

export default PrettyCode;
