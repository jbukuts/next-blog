import React from 'react';
import { ProcessedContent } from '../data-layer/pull-blog-data';
import styles from '../styles/components/ArticleTags.module.scss';
import TagBadge from './Badge';

type ArticleTagsProps = Pick<ProcessedContent, 'tags' | 'timeToRead' | 'date'>;

const ArticleTags: React.FC<ArticleTagsProps> = (props) => {
  // const router = useRouter();
  // onClick={() => router.push(`/?tags=${tag}`)}
  const { tags, timeToRead, date } = props;

  return (
    <div className={styles.articleTags}>
      {tags.map((tag, index) => (
        <TagBadge key={index}>{tag}</TagBadge>
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
