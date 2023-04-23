/* eslint-disable jsx-a11y/anchor-is-valid */
import { AnimatePresence, LazyMotion, m } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { Suspense, useContext } from 'react';
import profile from '../../../../profile';
import {
  useCurrentPath,
  useElementOnScreen,
  useScrollPercentage
} from '../../../hooks';
import TitleContext from '../../../state/TitleContext';
import ThemeToggle from '../../ThemeToggle/ThemeToggle';
import { Stack } from '../../UI';
import styles from './Header.module.scss';

const { firstName, lastName, siteTitle, headerImage } = profile;

const stickyHeaderMotions = {
  initial: { y: '-100%' },
  animate: { y: '0%' },
  exit: { y: '-100%' },
  transition: { duration: 0.1 }
};

const domAnimation = () =>
  import('framer-motion').then((mod) => mod.domAnimation);

const StickyHeader = () => {
  const scrollPercent = useScrollPercentage(50);
  const [currentTitle] = useContext(TitleContext);
  const currentPath = useCurrentPath();

  return (
    <Suspense fallback={null}>
      <LazyMotion features={domAnimation} strict>
        <Stack
          type='vertical'
          spacing='none'
          as={m.div}
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
              <Link href='#' replace as={currentPath}>
                {currentTitle || ''}
              </Link>
            </h5>
          </Stack>
        </Stack>
      </LazyMotion>
    </Suspense>
  );
};

const StaticHeader = React.forwardRef<Element>((_, ref) => (
  <Stack className={styles.staticBar} ref={ref} title='Back to home'>
    <Link href='/'>
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
));

const CombinedHeader = () => {
  const [headerRef, headerVisible] = useElementOnScreen({}, true);
  const router = useRouter();

  return (
    <header className={styles.header}>
      <AnimatePresence>
        {!headerVisible && router.pathname !== '/' && <StickyHeader />}
      </AnimatePresence>
      <StaticHeader ref={headerRef} />
    </header>
  );
};

export default CombinedHeader;
