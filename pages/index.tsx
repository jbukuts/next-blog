import { useRouter } from 'next/router';
import { MDXRemote } from 'next-mdx-remote';
import React, { useEffect, useState } from 'react';
import logger from '../logger';
import { Hello, PostCard } from '../src/components';
import { BasicHeadData } from '../src/components/SEO/StructuredBlogData';
import {
  ProcessedContent,
  getProcessedPostList
} from '../src/data-layer/pull-blog-data';

import styles from '../src/styles/pages/index.module.scss';

interface HomeProps {
  postList: ProcessedContent[];
  fullTagsList: string[];
}

const DISABLED_ROUTER = true;

const HeaderReplace = ({ children }: any) => <h2>{children}</h2>;
const LinkReplace = ({ children }: any) => <u>{children}</u>;

const components = {
  h1: HeaderReplace,
  a: LinkReplace
};

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
      <BasicHeadData />
      <main className={styles.homePage}>
        <Hello />
        {filteredList.map((postItem: ProcessedContent, i: number) => (
          <PostCard key={i} {...postItem}>
            <MDXRemote components={components} {...postItem.content} />
          </PostCard>
        ))}
      </main>
    </>
  );
};

export async function getStaticProps() {
  logger.info('Pulling in full post-list for landing page');
  const testPostList: ProcessedContent[] = await getProcessedPostList({});
  logger.info(`Number of articles pulled: ${testPostList.length}`);

  const fullTagsList: string[] = testPostList.reduce(
    (acc, { tags }) => [...acc, ...tags],
    [] as string[]
  );

  return {
    props: {
      postList: testPostList,
      fullTagsList: Array.from(new Set(fullTagsList))
    } as HomeProps,
    revalidate: 43200
  };
}

export default Home;
