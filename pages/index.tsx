import Head from 'next/head';
import { useRouter } from 'next/router';
import { MDXRemote } from 'next-mdx-remote';
import React, { useEffect, useState } from 'react';
import profile from '../profile';
import { Hello, PostCard } from '../src/components';
import {
  ProcessedContent,
  getProcessedPostList
} from '../src/data-layer/pull-blog-data';

import styles from '../styles/pages/index.module.scss';

interface HomeProps {
  postList: ProcessedContent[];
  fullTagsList: string[];
}

const DISABLED_ROUTER = false;

const { siteURI } = profile;

const LandingHead = () => (
  <Head key='landing-page'>
    <title>Blog @ jbukuts</title>
    <meta name='description' content="Jake Bukuts' Blog" />
    <link rel='icon' href='/favicon.ico' />
    <meta property='og:url' content={`https://${siteURI}`} />
    <meta property='og:title' content='Home' />

    <meta name='twitter:card' content='summary' />
    <meta name='twitter:title' content='Jake Bukuts Tech Blog' />
    <meta
      name='twitter:description'
      content='Here I write about random programming related things I encounter.'
    />
    <meta
      name='twitter:image'
      content={`https://${siteURI}/name-chrome.webp`}
    />
    <meta name='twitter:site' content={`https://${siteURI}`} />
    <meta name='twitter:creator' content='@jbukuts' />
  </Head>
);

const Home = (props: HomeProps) => {
  const { postList, fullTagsList } = props;
  const router = useRouter();
  const [filteredList, setFilteredList] = useState(postList);

  useEffect(() => {
    if (
      !router.isReady ||
      router.isFallback ||
      !router.query?.tags ||
      DISABLED_ROUTER
    )
      return;

    const {
      query: { tags }
    } = router;

    const splitTags = (tags as string).split(',');
    setFilteredList(() =>
      postList.filter((post) =>
        splitTags.some((tag) => post.tags.includes(tag))
      )
    );
  }, [fullTagsList, router, postList]);

  return (
    <>
      <LandingHead />
      <main className={styles.homePage}>
        <Hello />
        {filteredList.map((postItem: ProcessedContent, i: number) => (
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

  const fullTagsList: string[] = testPostList.reduce(
    (acc, { tags }) => [...acc, ...tags],
    [] as string[]
  );

  return {
    props: {
      postList: testPostList,
      fullTagsList: Array.from(new Set(fullTagsList))
    } as HomeProps
  };
}

export default Home;
