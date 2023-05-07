import Image from 'next/image';
import React from 'react';
import profile from '../../../../profile';
import { SmartLink } from '../../article-helpers';
import IconLink from '../../IconLink/IconLink';
import { Heading, Stack } from '../../UI';
import { Code, LinkedIn, Mail, RSS, Twitter } from '../../UI/icons';
import styles from './Footer.module.scss';

interface LinkStack {
  title: string;
  links: {
    title: string;
    href: string;
  }[];
}

const {
  linkedInProfile,
  githubProfile,
  twitterProfile,
  emailAddress,
  firstName,
  lastName,
  copyRightYear
} = profile;

const linkList: LinkStack[] = [
  {
    title: 'Built using',
    links: [
      { title: 'Next.js', href: 'https://nextjs.org/docs' },
      { title: 'Sass', href: 'https://sass-lang.com/' },
      { title: 'MDX', href: 'https://mdxjs.com/' },
      { title: 'GitHub API', href: 'https://docs.github.com/en/rest' }
    ]
  }
];

const socialsList = [
  { title: 'My email', href: `mailto:${emailAddress}`, icon: Mail },
  { title: 'Site code', href: `${githubProfile}/next-blog`, icon: Code },
  { title: 'RSS Feed', href: '/rss.xml', icon: RSS },
  { title: 'My Twitter', href: twitterProfile, icon: Twitter },
  { title: 'My LinkedIn', href: linkedInProfile, icon: LinkedIn }
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
      {links.map((val, index) => {
        const { href, title: linkTitle } = val;
        return (
          <SmartLink href={href} key={index}>
            <small>{linkTitle}</small>
          </SmartLink>
        );
      })}
    </Stack>
  );
};

const MoreAboutMe = () => (
  <Stack type='vertical' spacing='xl'>
    <Stack spacing='xl' className={styles.aboutMeEnd} responsive>
      <div className={styles.imageWrapper}>
        <Image src='/images/me.webp' alt='This is me' fill priority={false} />
      </div>
      <Stack type='vertical' spacing='none'>
        <Heading.H6>It&apos;s me again</Heading.H6>
        <p>
          <small>
            Thanks for reading.
            <br />
            If you&apos;d like updates feel free to{' '}
            <SmartLink href='/rss.xml'>subscribe via RSS</SmartLink> .
            <br />I try to create new posts weekly.
          </small>
        </p>
      </Stack>
    </Stack>
  </Stack>
);

const SocialLinks = () => (
  <>
    {socialsList.map(({ title, href, icon: Icon }, index) => (
      <IconLink key={index} href={href} title={title} icon={Icon} />
    ))}
  </>
);
const Footer = () => (
  <footer className={styles.footer}>
    <Stack className={styles.footerContent} spacing='xxl' type='vertical'>
      <Stack className={styles.spaceBetween} spacing='xxl' responsive>
        <MoreAboutMe />
        {linkList.map((linkStack, index) => (
          <LinkList key={index} linkStack={linkStack} />
        ))}
      </Stack>
      <Stack className={styles.socialsStack} responsive>
        <Stack spacing='none'>
          <SocialLinks />
        </Stack>
        <p>
          <small>
            © {copyRightYear} {firstName} {lastName} • Another Dev Blog ❤️
          </small>
        </p>
      </Stack>
    </Stack>
  </footer>
);

export default Footer;
