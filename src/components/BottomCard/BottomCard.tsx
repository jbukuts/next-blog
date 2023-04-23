import React from 'react';
import { Stack, Window } from '../UI';
import styles from './BottomCard.module.scss';

const Footer = () => (
  <Window topBar={false} className={styles.footer}>
    <video
      className={styles.footerVideo}
      onContextMenu={(event) => event.preventDefault()}
      autoPlay
      loop
      muted>
      <source src='/images/gits.mp4' type='video/mp4' />
    </video>
    <Stack type='vertical' spacing='none' className={styles.footerContent}>
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
    </Stack>
  </Window>
);

export default Footer;
