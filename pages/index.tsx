import { useRouter } from 'next/router';
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote';
import React, { useEffect, useState } from 'react';
import {
  BasicHeadData,
  Heading,
  Hello,
  Main,
  PostCard,
  Stack
} from '@/components/index';
import { getDataStoreSorted } from '@/data-layer/data-layer.mjs';
import { ProcessedContent } from '@/data-layer/index';
import logger from 'logger';
import styles from './index.module.scss';

interface HomeProps {
  postList: ProcessedContent[];
  fullTagsList: string[];
}

const DISABLED_ROUTER = true;

const components: MDXRemoteProps['components'] = {
  FlexContainer: React.Fragment,
  h1: Heading.H2,
  a: 'u'
};

const IndexPage = (props: HomeProps) => {
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
      <BasicHeadData />
      <Stack
        as={Main}
        type='vertical'
        spacing='xxl'
        className={styles.homePage}>
        <Hello />
        {filteredList.map((postItem: ProcessedContent, i: number) => (
          <PostCard key={i} {...postItem}>
            <MDXRemote components={components} {...postItem.content} />
          </PostCard>
        ))}
      </Stack>
    </>
  );
};

export async function getStaticProps() {
  logger.info('Pulling in full post-list for landing page');
  const postList = getDataStoreSorted();
  logger.info(`Number of articles pulled: ${postList.length}`);

  const fullTagsList: string[] = postList.reduce(
    (acc, { tags }) => [...acc, ...tags],
    [] as string[]
  );

  return {
    props: {
      postList: postList as ProcessedContent[],
      fullTagsList: Array.from(new Set(fullTagsList))
    } as HomeProps,
    revalidate: 43200
  };
}

export default IndexPage;
