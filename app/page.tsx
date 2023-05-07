/* eslint-disable arrow-body-style */
import { Metadata } from 'next';
import { MDXRemoteProps } from 'next-mdx-remote';
import React from 'react';
import { Hello, PostCard } from '@/components/index';
import { Main } from '@/components/Layout/index';
import { Heading, Stack } from '@/components/UI/index';
import { ProcessedContent, getDataStoreSorted } from '@/data-layer/index';
import styles from '@/styles/pages/index.module.scss';
import profile from 'profile';

interface HomeData {
  postList: ProcessedContent[];
  fullTagsList: string[];
}

const { siteTitle } = profile;

const components: MDXRemoteProps['components'] = {
  FlexContainer: React.Fragment,
  h1: Heading.H2,
  a: 'u'
};

export const metadata: Metadata = {
  title: siteTitle
};

export const dynamic = 'force-static';

// pull in post list
async function getData(): Promise<HomeData> {
  const postList = await getDataStoreSorted({
    components,
    fetchOptions: { next: { tags: ['post-list'], revalidate: 86400 } }
  });

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
