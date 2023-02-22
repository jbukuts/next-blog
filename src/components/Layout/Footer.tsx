import React from 'react';
import Window from '../Window';
import styles from './Footer.module.scss';

const Footer = () => (
  <Window topBar={false} as='footer' className={styles.footer}>
    <video
      className={styles.footerVideo}
      onContextMenu={(event) => event.preventDefault()}
      autoPlay
      loop
      muted>
      <source src='/images/gits.mp4' type='video/mp4' />
    </video>
    <div className={styles.footerContent}>
      <h1>Thanks for reading</h1>
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
