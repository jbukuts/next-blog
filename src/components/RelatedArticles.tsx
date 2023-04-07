import cx from 'classnames';
import NextLink from 'next/link';
import React, { Suspense } from 'react';
import { ProcessedContent } from '../data-layer/pull-blog-data';
import styles from '../styles/components/RelatedArticles.module.scss';
import TagBadge from './Badge';
import { SideBar } from './Layout';

export type RelatedPost = Pick<
  ProcessedContent,
  'title' | 'slug' | 'date' | 'tags' | 'timeToRead'
>;

interface RelatedArticlesProps {
  currentSlug: string;
  postList: RelatedPost[];
}

const RelatedPostItem = (props: RelatedPost) => {
  const { title, slug, tags, date, timeToRead } = props;
  return (
    <div className={cx(styles.relatedArticle, styles.verticalStack)}>
      <NextLink href={`/post/${slug}`}>
        <h2>{title}</h2>
      </NextLink>
      <div className={cx(styles.horizontalStack)}>
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
        <div className={cx(styles.horizontalStack)}>
          {tags.map((t, index) => (
            <TagBadge key={index} size='sm'>
              {t}
            </TagBadge>
          ))}
        </div>
      </div>
    </div>
  );
};

const RelatedArticles = (props: RelatedArticlesProps) => {
  const { postList } = props;

  return (
    <SideBar
      side='left'
      className={cx(styles.relatedArticles, styles.verticalStack)}>
      <h2>Recent Articles</h2>
      {postList.map((post, index) => (
        <RelatedPostItem key={index} {...post} />
      ))}
    </SideBar>
  );
};

export default RelatedArticles;
