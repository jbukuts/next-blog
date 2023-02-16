// import cx from 'classnames';
import Link from 'next/link';
import React from 'react';
import { ProcessedContent } from '../../helpers/pull-blog-data';
import styles from './RelatedArticles.module.scss';

export type RelatedPost = Pick<
  ProcessedContent,
  'title' | 'slug' | 'date' | 'tags'
>;

interface RelatedArticlesProps {
  currentSlug: string;
  postList: RelatedPost[];
}

const RelatedPostItem = (props: RelatedPost) => {
  const { title, slug, tags } = props;
  return (
    <span className={styles.relatedPost}>
      <h2>
        <Link href={`/post/${slug}`}>{title}</Link>
      </h2>
      {tags.map((t) => (
        <span>{t}</span>
      ))}
    </span>
  );
};

const RelatedArticles = (props: RelatedArticlesProps) => {
  const { postList } = props;

  return (
    <div className={styles.relatedArticles}>
      <h1>Other Articles</h1>
      {postList.map((post) => (
        <RelatedPostItem {...post} />
      ))}
    </div>
  );
};

export default RelatedArticles;
