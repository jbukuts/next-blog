import NextLink from 'next/link';
import React, { Suspense } from 'react';
import { ProcessedContent } from '../data-layer/pull-blog-data';
import styles from '../styles/components/RelatedArticles.module.scss';
import TagBadge from './Badge';
import { SideBar, Stack } from './Layout';

export type RelatedPost = Pick<
  ProcessedContent,
  'title' | 'slug' | 'date' | 'tags' | 'timeToRead'
>;

interface RelatedArticlesProps {
  postList: RelatedPost[];
}

const RelatedPostItem = (props: RelatedPost) => {
  const { title, slug, tags, date, timeToRead } = props;
  return (
    <Stack type='vertical' className={styles.relatedArticle}>
      <NextLink href={`/post/${slug}`}>
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
            <TagBadge key={index} size='sm'>
              {t}
            </TagBadge>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

const RelatedArticles = (props: RelatedArticlesProps) => {
  const { postList } = props;

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
};

export default RelatedArticles;
