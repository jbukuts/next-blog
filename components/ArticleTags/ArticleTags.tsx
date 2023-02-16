import React from 'react';
import { ProcessedContent } from '../../helpers/pull-blog-data';
import styles from './ArticleTags.module.scss';

type ArticleTagsProps = Pick<ProcessedContent, 'tags' | 'timeToRead' | 'date'>;

const ArticleTags: React.FC<ArticleTagsProps> = (props) => {
  const { tags, timeToRead, date } = props;

  return (
    <span className={styles.articleTags}>
      {tags.map((tag, index) => (
        <p key={index}>{tag}</p>
      ))}
      <p>{timeToRead} min</p>
      <p>Published on {new Date(date).toLocaleDateString()}</p>
    </span>
  );
};

export default ArticleTags;
