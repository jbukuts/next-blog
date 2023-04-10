/* eslint-disable jsx-a11y/anchor-is-valid */
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { useElementOnScreen } from '../../hooks';
import TitleContext from '../../state/TitleContext';
import styles from '../../styles/components/Layout/Header.module.scss';

const Header = () => {
  const [hearderRef, visible] = useElementOnScreen();
  const router = useRouter();
  const { currentTitle } = useContext(TitleContext);

  return (
    <header className={styles.header} title='Back to home'>
      {!visible && router.pathname !== '/' && (
        <div className={styles.stickyBar}>
          <h3>
            <Link href='/'>
              <b>Jake Bukuts</b>
            </Link>
          </h3>
          <h5>
            <Link href='#' replace>
              {currentTitle}
            </Link>
          </h5>
        </div>
      )}
      <div className={styles.bar} ref={hearderRef}>
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
