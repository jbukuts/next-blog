import NextLink from 'next/link';
import React, { Suspense } from 'react';
import SideBar from '@/components/Layout/SideBar';
import Badge from '@/components/UI/Badge';
import Stack from '@/components/UI/Stack';
import { ProcessedContent, getDataStoreSorted } from '@/data-layer/index';
import styles from './RelatedArticles.module.scss';

export type RelatedPost = Pick<
  ProcessedContent,
  'title' | 'slug' | 'date' | 'tags' | 'timeToRead'
>;

interface RelatedArticlesProps {
  currentSlug: string;
}

async function getRecentPost(pageSlug: string): Promise<RelatedPost[]> {
  const dataStore = await getDataStoreSorted({
    fetchOptions: { next: { tags: ['post-list'], revalidate: 86400 } }
  });

  return dataStore
    .map((item: any) => ({
      title: item.title,
      slug: item.slug,
      date: item.date,
      tags: item.tags,
      timeToRead: item.timeToRead
    }))
    .filter(({ slug }) => slug !== pageSlug);
}

const RelatedPostItem = (props: RelatedPost) => {
  const { title, slug, tags, date, timeToRead } = props;
  return (
    <Stack type='vertical' className={styles.relatedArticle}>
      <NextLink href={`/post/${slug}`} className={styles.linkItem}>
        <h2>{title}</h2>
      </NextLink>
      <Stack className={styles.horizontalStack}>
        <p>
          <Suspense fallback={null}>
            {new Date(date).toLocaleDateString('en-US', {
              year: '2-digit',
              month: 'numeric',
              day: 'numeric'
            })}
          </Suspense>
          {' • '}
          {timeToRead} min
        </p>
        <Stack spacing='xs' className={styles.horizontalStack}>
          {tags.map((t, index) => (
            <Badge key={index} size='sm'>
              {t}
            </Badge>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

async function RelatedArticles(props: RelatedArticlesProps) {
  const { currentSlug } = props;
  const postList = await getRecentPost(currentSlug);

  return (
    <Stack
      as={SideBar}
      side='left'
      className={styles.relatedArticles}
      type='vertical'>
      <h2>Recent Posts</h2>
      {postList.map((post, index) => (
        <RelatedPostItem key={index} {...post} />
      ))}
    </Stack>
  );
}

export default RelatedArticles;
