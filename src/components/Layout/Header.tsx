/* eslint-disable jsx-a11y/anchor-is-valid */
import cx from 'classnames';
import { AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import profile from '../../../profile';
import { useElementOnScreen } from '../../hooks';
import TitleContext from '../../state/TitleContext';
import styles from '../../styles/components/Layout/Header.module.scss';

const MotionDiv = dynamic(() =>
  import('framer-motion').then(({ motion }) => motion.div)
);

const { firstName, lastName } = profile;

const stickyHeaderMotions = {
  initial: { y: '-100%' },
  animate: { y: '0%' },
  exit: { y: '-100%' },
  transition: { duration: 0.1 }
};

const Header = () => {
  const [headerRef, headerVisible] = useElementOnScreen();
  const router = useRouter();
  const { currentTitle } = useContext(TitleContext);

  return (
    <header className={styles.header} title='Back to home'>
      <AnimatePresence>
        {!headerVisible && router.pathname !== '/' && (
          <MotionDiv {...stickyHeaderMotions} className={cx(styles.stickyBar)}>
            <h3>
              <Link href='/'>
                <b>{`${firstName} ${lastName}`}</b>
              </Link>
            </h3>
            <h5>
              <Link href='#' replace>
                {currentTitle}
              </Link>
            </h5>
          </MotionDiv>
        )}
      </AnimatePresence>

      <div className={styles.bar} ref={headerRef}>
        <Link href='/'>
          <Image
            style={{ imageRendering: 'crisp-edges' }}
            priority
            width={200}
            height={83}
            alt='Bukuts Blog'
            src='/name-chrome.webp'
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;
