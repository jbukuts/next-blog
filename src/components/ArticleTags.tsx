import { useRouter } from 'next/router';
import React from 'react';
import { ProcessedContent } from '../data-layer/pull-blog-data';
import styles from './ArticleTags.module.scss';
import TagBadge from './Badge';

type ArticleTagsProps = Pick<ProcessedContent, 'tags' | 'timeToRead' | 'date'>;

const ArticleTags: React.FC<ArticleTagsProps> = (props) => {
  const router = useRouter();
  const { tags, timeToRead, date } = props;

  return (
    <div className={styles.articleTags}>
      {tags.map((tag, index) => (
        <TagBadge key={index} onClick={() => router.push(`/?tags=${tag}`)}>
          {tag}
        </TagBadge>
      ))}
      <TagBadge>{timeToRead} min</TagBadge>
      <TagBadge>
        Posted on{' '}
        {new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}
      </TagBadge>
    </div>
  );
};

export default ArticleTags;
