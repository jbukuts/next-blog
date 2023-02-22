import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import styles from './Header.module.scss';

const Header = () => (
  <header className={styles.header} title='Back to home'>
    <Link href='/'>
      <Image
        style={{ imageRendering: 'crisp-edges' }}
        priority
        width={200}
        height={83}
        alt='Bukut Blog'
        src='/name-chrome.webp'
      />
    </Link>
  </header>
);

export default Header;
