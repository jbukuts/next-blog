import React from 'react';
import styles from '../../styles/components/Layout/Footer.module.scss';
import Window from '../Window';

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
      <h2>Thanks for reading</h2>
      <h3>
        Site code available{' '}
        <a
          target='_blank'
          href='https://github.com/jbukuts/next-blog'
          rel='noreferrer'>
          here
        </a>
      </h3>
    </div>
  </Window>
);

export default Footer;
