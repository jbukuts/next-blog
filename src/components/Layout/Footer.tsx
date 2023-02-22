import Image from 'next/image';
import React from 'react';
import Window from '../Window';
import styles from './Footer.module.scss';

const Footer = () => (
  <Window topBar={false} as='footer' className={styles.footer}>
    <Image
      className={styles.footerImage}
      src='/gits.gif'
      alt='Footer image'
      loading='lazy'
      fill
    />
    <div className={styles.footerContent}>
      <h1>🤩 Thanks for reading 🤩</h1>
      <h2>
        Site code available{' '}
        <a
          target='_blank'
          href='https://github.com/jbukuts/next-blog'
          rel='noreferrer'>
          here
        </a>
      </h2>
    </div>
  </Window>
);

export default Footer;
