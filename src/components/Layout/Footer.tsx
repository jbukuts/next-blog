import Image from 'next/image';
import React from 'react';
import { TbSourceCode as Code, TbMail as Mail } from 'react-icons/tb';
import { TiRss as RSS } from 'react-icons/ti';
import profile from '../../../profile';
import styles from '../../styles/components/Layout/Footer.module.scss';
import { SmartLink } from '../ArticleHelpers';
import IconLink from '../IconLink';
import { Heading, Stack } from '../UI';

interface LinkStack {
  title: string;
  links: {
    [name: string]: {
      href: string;
    };
  };
}

const {
  linkedInProfile,
  soundCloudProfile,
  githubProfile,
  twitterProfile,
  emailAddress,
  firstName,
  lastName,
  copyRightYear
} = profile;

const linkList: LinkStack[] = [
  {
    title: 'My socials',
    links: {
      Github: {
        href: githubProfile
      },
      Twitter: {
        href: twitterProfile
      },
      LinkedIn: {
        href: linkedInProfile
      },
      SoundCloud: {
        href: soundCloudProfile
      }
    }
  }
];

interface LinkStackProps {
  linkStack: LinkStack;
}

const LinkList = (props: LinkStackProps) => {
  const {
    linkStack: { title, links }
  } = props;

  return (
    <Stack type='vertical' spacing='none' className={styles.linkList}>
      <Heading.H6>{title}</Heading.H6>
      {Object.entries(links).map(([key, val], index) => {
        const { href } = val;
        return (
          <SmartLink href={href} key={index}>
            <small>{key}</small>
          </SmartLink>
        );
      })}
    </Stack>
  );
};

const MoreAboutMe = () => (
  <Stack type='vertical' spacing='xl'>
    <Stack spacing='xl' className={styles.aboutMeEnd}>
      <div className={styles.imageWrapper}>
        <Image
          src='/images/me.webp'
          alt='This is me'
          fill
          width={320}
          height={240}
          priority
        />
      </div>
      <Stack type='vertical' spacing='none'>
        <Heading.H6>It&apos;s me again</Heading.H6>
        <p>
          <small>
            Thanks for reading.
            <br />
            If you&apos;d like updates feel free to subscribe via RSS.
            <br />I try to create new posts weekly.
          </small>
        </p>
      </Stack>
    </Stack>
  </Stack>
);

const Footer = () => (
  <footer className={styles.footer}>
    <Stack className={styles.footerContent} spacing='xxl' type='vertical'>
      <Stack className={styles.spaceBetween} spacing='xxl'>
        <MoreAboutMe />
        {linkList.map((linkStack, index) => (
          <LinkList key={index} linkStack={linkStack} />
        ))}
      </Stack>
      <Stack className={styles.spaceBetween}>
        <Stack spacing='none'>
          <IconLink href={`mailto:${emailAddress}`} title='Email' icon={Mail} />
          <IconLink
            href={`${githubProfile}/next-blog`}
            title='Site Code'
            icon={Code}
          />
          <IconLink href='/rss.xml' title='RSS Feed' icon={RSS} />
        </Stack>
        <p>
          <small className={styles.copyRight}>
            © {copyRightYear} {firstName} {lastName}
          </small>
        </p>
      </Stack>
    </Stack>
  </footer>
);

export default Footer;
