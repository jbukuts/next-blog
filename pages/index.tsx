import Head from 'next/head';
import { MDXRemote } from 'next-mdx-remote';
import React from 'react';
import { Hello, PostCard } from '../src/components';
import {
  ProcessedContent,
  getProcessedPostList
} from '../src/data-layer/pull-blog-data';

import styles from '../styles/pages/index.module.scss';

interface HomeProps {
  postList: ProcessedContent[];
}

const Home = (props: HomeProps) => {
  const { postList } = props;

  return (
    <>
      <Head key='landing-page'>
        <title>Blog @ jbukuts</title>
        <meta name='description' content="Jake Bukuts' Blog" />
        <link rel='icon' href='/favicon.ico' />
        <meta property='og:url' content='https://jbukuts.com' />
        <meta property='og:title' content='Home' />
      </Head>
      <main className={styles.homePage}>
        <Hello />
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
