import React, { useRef, useState } from 'react';
import styles from '../styles/components/PrettyCode.module.scss';

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
    <div ref={codeRef} className={styles.prettyCode}>
      {children}
      {copyButton && (
        <button
          type='button'
          onClick={onCopyClick}
          className={styles.copyButton}>
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
