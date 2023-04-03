import cx from 'classnames';
import React from 'react';
import styles from '../../styles/components/Layout/SideBar.module.scss';

interface SideBarProps {
  side: 'left' | 'right';
  className?: string;
  children: React.ReactNode;
}

const SideBar = (props: SideBarProps) => {
  const { side, children, className } = props;

  return <nav className={cx(className, styles[side])}>{children}</nav>;
};

SideBar.defaultProps = {
  className: undefined
};

export default SideBar;
