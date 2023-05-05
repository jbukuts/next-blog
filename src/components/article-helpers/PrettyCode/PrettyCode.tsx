'use client';

import cx from 'classnames';
import React, { useRef, useState } from 'react';
import { Stack } from '../../UI';
import styles from './PrettyCode.module.scss';
import '@/styles/highlight.scss';

interface CodeBlockProps extends React.HTMLAttributes<HTMLElement> {
  'data-language'?: string;
}

interface MultiLineWrapperProps extends Omit<CodeBlockProps, 'data-language'> {
  progLang?: string;
}

const MultiLineWrapper = (props: MultiLineWrapperProps) => {
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
      <Stack className={styles.infoBar} spacing='none' reverse>
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
      </Stack>
    </div>
  );
};

const CodeBlock = (props: CodeBlockProps) => {
  const { children, 'data-language': progLang, className = '' } = props;

  const isBlock =
    progLang !== undefined || className.split(' ').includes('hljs');

  return React.createElement(
    isBlock ? MultiLineWrapper : 'code',
    {
      className: cx(styles.code, className),
      ...(isBlock && { progLang })
    },
    children
  );
};

export default CodeBlock;
