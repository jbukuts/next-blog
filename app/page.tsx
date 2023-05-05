/* eslint-disable arrow-body-style */
import { Metadata } from 'next';
import { MDXRemoteProps } from 'next-mdx-remote';
import React from 'react';
import Hello from '@/components/Hello';
import Main from '@/components/Layout/Main';
import PostCard from '@/components/PostCard';
import Heading from '@/components/UI/Heading';
import Stack from '@/components/UI/Stack';
import { getDataStoreSorted } from '@/data-layer/data-layer';
import { ProcessedContent } from '@/data-layer/types';
import styles from '@/styles/pages/index.module.scss';
import profile from 'profile';

interface HomeData {
  postList: ProcessedContent[];
  fullTagsList: string[];
}

const { jobTitle } = profile;

const components: MDXRemoteProps['components'] = {
  FlexContainer: React.Fragment,
  h1: Heading.H2,
  a: 'u'
};

export const metadata: Metadata = {
  title: jobTitle
};

export const dynamic = 'force-static';

async function getData(): Promise<HomeData> {
  const postList = await getDataStoreSorted({ components });

  const fullTagsList: string[] = postList.reduce(
    (acc, { tags }) => [...acc, ...tags],
    [] as string[]
  );

  return {
    postList: postList as ProcessedContent[],
    fullTagsList: Array.from(new Set(fullTagsList))
  };
}

const IndexPage = async () => {
  const { postList } = await getData();

  return (
    <Stack as={Main} type='vertical' spacing='xxl' className={styles.homePage}>
      <Hello />
      {postList.map((postItem: ProcessedContent, i: number) => (
        <PostCard key={i} {...postItem}>
          {postItem.content}
        </PostCard>
      ))}
    </Stack>
  );
};

export default IndexPage;
