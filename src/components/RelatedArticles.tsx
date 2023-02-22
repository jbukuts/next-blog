import cx from 'classnames';
import NextLink from 'next/link';
import React from 'react';
import { ProcessedContent } from '../data-layer/pull-blog-data';
import TagBadge from './Badge';
import styles from './RelatedArtices.module.scss';

export type RelatedPost = Pick<
  ProcessedContent,
  'title' | 'slug' | 'date' | 'tags'
>;

interface RelatedArticlesProps {
  currentSlug: string;
  postList: RelatedPost[];
}

const RelatedPostItem = (props: RelatedPost) => {
  const { title, slug, tags, date } = props;
  return (
    <div className={cx(styles.relatedArticle, styles.verticalStack)}>
      <NextLink href={`/post/${slug}`}>
        <h2>{title}</h2>
      </NextLink>
      <div className={cx(styles.horizontalStack)}>
        <p>
          {new Date(date).toLocaleDateString('en-US', {
            year: '2-digit',
            month: 'numeric',
            day: 'numeric'
          })}
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
    <div className={cx(styles.relatedArticles, styles.verticalStack)}>
      <h1>Recent Articles</h1>
      {postList.map((post, index) => (
        <RelatedPostItem key={index} {...post} />
      ))}
    </div>
  );
};

export default RelatedArticles;
