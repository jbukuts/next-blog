'use client';

import cx from 'classnames';
import React, { useState } from 'react';
import Stack from '../Stack';
import styles from './Accordion.module.scss';

interface AccordionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  showText?: string;
  minText?: string;
  defaultState?: boolean;
}

const Accordion = (props: AccordionProps) => {
  const {
    children,
    showText = 'Show more',
    minText = 'Show less',
    defaultState = false
  } = props;

  const [open, setOpen] = useState(defaultState);
  const toggle = () => setOpen((o) => !o);

  return (
    <Stack type='vertical'>
      <div className={cx(styles.wrapper, open && styles.open)}>
        <div className={styles.content}>{children}</div>
      </div>
      <button type='button' onClick={toggle} className={styles.button}>
        {open ? minText : showText}
      </button>
    </Stack>
  );
};

export default Accordion;
