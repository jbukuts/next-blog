import cx from 'classnames';
import React, { useRef, useState } from 'react';
import styles from '../styles/components/PrettyCode.module.scss';

interface CodeBlockProps extends React.HTMLAttributes<HTMLElement> {
  'data-language'?: string;
}

interface MultiLineWrapperProps extends Omit<CodeBlockProps, 'data-language'> {
  progLang?: string;
}

const MultiLineWrapper: React.FC<MultiLineWrapperProps> = (props) => {
  const { children, className, progLang } = props;
  const codeRef = useRef(null);
  const [clicked, setClicked] = useState(false);

  const onCopyClick = () => {
    const { current } = codeRef;
    if (!current) return;
    navigator.clipboard.writeText((current as Element)?.textContent || '');
    setClicked(true);
  };

  return (
    <div className={styles.prettyCodeContainer}>
      <div ref={codeRef} className={cx(className, styles.codeWrapper)}>
        {children}
      </div>
      <div className={styles.infoBar} aria-hidden='true'>
        <button
          type='button'
          onClick={onCopyClick}
          className={styles.copyButton}>
          {clicked ? 'Copied' : 'Copy'}
        </button>
        {progLang && (
          <div>
            <p>{progLang}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CodeBlock: React.FC<CodeBlockProps> = (props) => {
  const { children, 'data-language': progLang } = props;

  const isInline = progLang === undefined;

  return React.createElement(
    isInline ? 'code' : MultiLineWrapper,
    {
      className: cx(styles.code),
      ...(!isInline && { progLang })
    },
    children
  );
};

export default CodeBlock;
