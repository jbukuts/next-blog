import Image from 'next/image';
import React from 'react';
import { FiGithub as Github, FiTwitter as Twitter } from 'react-icons/fi';
import { GrSoundcloud as SoundCloud } from 'react-icons/gr';
import { RiLinkedinFill as LinkedIn } from 'react-icons/ri';
import profile from '../../profile';
import styles from '../styles/components/Hello.module.scss';
import IconLink from './IconLink';
import { Stack } from './UI';

const { aboutMe, imageWrapper, socials, helloContent } = styles;
const {
  firstName,
  lastName,
  linkedInProfile,
  twitterProfile,
  githubProfile,
  soundCloudProfile
} = profile;

const ICON_SIZE = 24;

const Hello = () => (
  <Stack className={aboutMe} spacing='xxl'>
    <div className={imageWrapper}>
      <Image
        src='/images/me.webp'
        alt='This is me'
        fill
        width={320}
        height={240}
        priority
      />
    </div>

    <Stack className={helloContent} type='vertical'>
      <h1>
        Hi, I&apos;m <b>{`${firstName} ${lastName}`}</b>.✌
      </h1>
      <p>
        I graduated from the University of South Carolina with a Bachelor&apos;s
        Degree in Computer Science. Most of my day to day work revolves around
        front-end and back-end web development.
      </p>
      <p>Here I blog about random code I&apos;ve written.</p>

      <Stack className={socials} spacing='none'>
        <IconLink
          href={githubProfile}
          title='My Github'
          icon={Github}
          fill
          size={ICON_SIZE}
        />
        <IconLink
          href={twitterProfile}
          title='My Twitter'
          icon={Twitter}
          size={ICON_SIZE}
          fill
        />
        <IconLink
          href={soundCloudProfile}
          title='My SoundCloud'
          icon={SoundCloud}
          size={ICON_SIZE}
        />
        <IconLink
          href={linkedInProfile}
          title='My LinkedIn'
          icon={LinkedIn}
          size={ICON_SIZE}
        />
      </Stack>
    </Stack>
  </Stack>
);

export default Hello;
