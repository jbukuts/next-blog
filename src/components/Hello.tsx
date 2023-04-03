import Image from 'next/image';
import React from 'react';
import { FaGithub, FaLinkedin, FaSoundcloud, FaTwitter } from 'react-icons/fa';
import profile from '../../profile';
import styles from '../styles/components/Hello.module.scss';

const { aboutMe, imageWrapper, socials, socialLink } = styles;
const {
  firstName,
  lastName,
  linkedInProfile,
  twitterProfile,
  githubProfile,
  soundCloudProfile
} = profile;

interface SocialLinkProps {
  href: string;
  children: React.ReactNode;
}

const SocialLink = (props: SocialLinkProps) => {
  const { href, children } = props;

  return (
    <a href={href} target='_blank' rel='noreferrer' className={socialLink}>
      {children}
    </a>
  );
};

const Hello = () => (
  <div className={aboutMe}>
    <div className={imageWrapper}>
      <Image
        src='/images/me.webp'
        alt='This is me'
        fill
        width={639}
        height={480}
      />
    </div>

    <div style={{ flexShrink: 2 }}>
      <h1>
        Hi, I&apos;m <b>{`${firstName} ${lastName}`}</b>.✌
      </h1>
      <p>
        I graduated from the University of South Carolina with a Bachelor&apos;s
        Degree in Computer Science. Most of my day to day work revolves around
        front-end and back-end web development.
      </p>
      <p>Here I blog about random code I&apos;ve written.</p>

      <div className={socials}>
        <SocialLink href={githubProfile}>
          <FaGithub title='My Github' />
        </SocialLink>

        <SocialLink href={twitterProfile}>
          <FaTwitter title='My Twitter' />
        </SocialLink>

        <SocialLink href={linkedInProfile}>
          <FaLinkedin title='My LinkedIn' />
        </SocialLink>

        <SocialLink href={soundCloudProfile}>
          <FaSoundcloud title='My SoundCloud' />
        </SocialLink>
      </div>
    </div>
  </div>
);

export default Hello;
