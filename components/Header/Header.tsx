import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import styles from './Header.module.scss';

const Header = () => (
  <header className={styles.header} title='Back to Home'>
    <Link href='/'>
      <Image
        priority
        width={240}
        height={100}
        alt='Bukut Blog'
        src='/name-chrome.webp'
      />
    </Link>
  </header>
);

export default Header;
