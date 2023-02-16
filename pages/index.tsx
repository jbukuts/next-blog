import Head from 'next/head';
import React from 'react';
import { PostCard } from '../components';
import {
  ProcessedContent,
  getProcessedPostList
} from '../helpers/pull-blog-data';

interface HomeProps {
  postList: ProcessedContent[];
}

const Home = (props: HomeProps) => {
  const { postList } = props;

  return (
    <main>
      <Head>
        <title>Jake&apos;s Blog - home</title>
        <meta name='description' content='Collection of stuff' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      {postList.map((postItem: any, index: number) => (
        <PostCard key={index} {...postItem} />
      ))}
    </main>
  );
};

export async function getStaticProps() {
  const testPostList: ProcessedContent[] = await getProcessedPostList({});

  return {
    props: { postList: testPostList } as HomeProps
  };
}

export default Home;
