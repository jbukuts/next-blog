'use client';

/* eslint-disable jsx-a11y/anchor-is-valid */
import cx from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useContext, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import SmartLink from '@/components/article-helpers/SmartLink';
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle';
import { Stack } from '@/components/UI';
import useElementOnScreen from '@/hooks/useElementOnScreen';
import useScrollPercentage from '@/hooks/useScrollPercentage';
import profile from 'profile';
import TitleContext from 'src/state/TitleContext';
import styles from './Header.module.scss';

const HIDE_SCROLL_PATHS = ['/', '/resume', '/projects'];
const HEADER_PATHS = [
  { path: '/', name: 'Blog', regex: /^\/post\/*/ },
  { path: '/projects', name: 'Projects' },
  { path: '/resume', name: 'Work History' }
];
const { firstName, lastName, siteTitle, headerImage } = profile;

const stickyHeaderMotions = {
  initial: { y: '-100%' },
  animate: { y: '0%' },
  exit: { y: '-100%' },
  transition: { duration: 0.1 }
};

const StickyHeader = ({ show }: { show: boolean }) => {
  const scrollPercent = useScrollPercentage(50);
  const [currentTitle] = useContext(TitleContext);
  const nodeRef = useRef(null);

  return (
    <CSSTransition
      in={show}
      nodeRef={nodeRef}
      timeout={100}
      unmountOnExit
      classNames='sticky-header'>
      <Stack
        ref={nodeRef}
        type='vertical'
        spacing='none'
        {...stickyHeaderMotions}
        className={styles.stickyBarWrapper}>
        <div
          style={{
            width: `${(scrollPercent * 100).toPrecision(3)}%`
          }}
          className={styles.stickyBarScroll}
        />
        <Stack className={styles.stickyBarContent}>
          <h3 title='Back to home'>
            <Link href='/'>
              <b>{`${firstName} ${lastName}`}</b>
            </Link>
          </h3>
          <h5 title='Back to top'>
            <SmartLink href='#' className={styles.unsetLink}>
              {currentTitle || ''}
            </SmartLink>
          </h5>
        </Stack>
      </Stack>
    </CSSTransition>
  );
};

const StaticHeader = React.forwardRef<Element, { pathName: string }>(
  ({ pathName }, ref) => (
    <Stack type='vertical'>
      <Stack className={styles.staticBar} ref={ref}>
        <Link href='/' title='Back to home'>
          <Image
            priority
            width={2000}
            height={836}
            alt={siteTitle}
            src={headerImage}
          />
        </Link>
        <ThemeToggle />
      </Stack>
      <Stack as='nav'>
        {HEADER_PATHS.map(({ path, name, regex }) => (
          <Link
            href={path}
            key={path}
            className={cx(
              (pathName === path || regex?.test(pathName)) && styles.activePath
            )}>
            {name}
          </Link>
        ))}
      </Stack>
    </Stack>
  )
);

const CombinedHeader = () => {
  const [headerRef, headerVisible] = useElementOnScreen({}, true);
  const pathName = usePathname();

  return (
    <header className={styles.header}>
      <StickyHeader
        show={!headerVisible && !HIDE_SCROLL_PATHS.includes(pathName)}
      />
      <StaticHeader ref={headerRef} pathName={pathName} />
    </header>
  );
};

export default CombinedHeader;
