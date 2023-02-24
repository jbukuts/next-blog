import Image from 'next/image';
import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import styles from './Hello.module.scss';

const { aboutMe, imageWrapper, socials, socialLink } = styles;

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
      <Image src='/images/me.webp' alt='This is me' fill />
    </div>

    <div style={{ flexShrink: 2 }}>
      <h1>
        Hi, I&apos;m <b>Jake Bukuts</b>.✌
      </h1>
      <p>
        I graduated from the University of South Carolina with a Bachelor&apos;s
        Degree in Computer Science. Most of my day to day work revolves around
        front-end and back-end web development.
      </p>
      <p>Here I blog about random code I&apos;ve written.</p>

      <div className={socials}>
        <SocialLink href='https://github.com/jbukuts'>
          <FaGithub title='My Github' />
        </SocialLink>

        <SocialLink href='https://twitter.com/jbukuts'>
          <FaTwitter title='My Twitter' />
        </SocialLink>

        <SocialLink href='https://www.linkedin.com/in/jake-bukuts'>
          <FaLinkedin title='My LinkedIn' />
        </SocialLink>
      </div>
    </div>
  </div>
);

export default Hello;
