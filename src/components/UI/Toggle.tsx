/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { MouseEventHandler } from 'react';
import styles from '../../styles/components/UI/Toggle.module.scss';

interface ToggleProps {
  onClick?: MouseEventHandler<HTMLInputElement>;
  id: string;
  defaultChecked?: boolean;
  ariaLabel?: string;
}

const Toggle = (props: ToggleProps) => {
  const { onClick, id: domId, defaultChecked, ariaLabel } = props;

  return (
    <div className={styles.toggle}>
      <input
        aria-label={ariaLabel}
        type='checkbox'
        id={domId}
        onClick={onClick}
        defaultChecked={defaultChecked}
      />
      <label htmlFor={domId} />
    </div>
  );
};

export default Toggle;
