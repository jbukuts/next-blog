import Head from 'next/head';
import Image from 'next/image';
import { MDXRemote } from 'next-mdx-remote';
import React from 'react';
import { PostCard } from '../src/components';
import { SharedHeader } from '../src/components/SEO';
import {
  ProcessedContent,
  getProcessedPostList
} from '../src/data-layer/pull-blog-data';

import styles from '../styles/pages/index.module.scss';

interface HomeProps {
  postList: ProcessedContent[];
}

const AboutMeCard = () => (
  <div className={styles.aboutMe}>
    <div className={styles.imageWrapper}>
      <Image src='/me.png' alt='This is me' fill />
    </div>
    <div style={{ flexShrink: 2 }}>
      <h1>Hello ✌</h1>
      <p>Hi, I&apos;m Jake Bukuts.</p>
      <p>
        I graduated from the University of South Carolina with a Bachelor&apos;s
        Degree in Computer Science. Most of my day to day work revolves around
        front-end and back-end web development.
      </p>
    </div>
  </div>
);

const Home = (props: HomeProps) => {
  const { postList } = props;

  return (
    <>
      <Head>
        <title>Blog @ jbukuts</title>
        <meta name='description' content="Jake Bukuts' Blog" />
        <link rel='icon' href='/favicon.ico' />
        <meta property='og:url' content='https://jbukuts.com' />
        <meta property='og:title' content='Home' />
      </Head>
      <SharedHeader />
      <main className={styles.homePage}>
        <AboutMeCard />
        {postList.map((postItem: ProcessedContent, i: number) => (
          <PostCard key={i} {...postItem}>
            <MDXRemote {...postItem.content} lazy />
          </PostCard>
        ))}
      </main>
    </>
  );
};

export async function getStaticProps() {
  const testPostList: ProcessedContent[] = await getProcessedPostList({});

  return {
    props: { postList: testPostList } as HomeProps
  };
}

export default Home;
