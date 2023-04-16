import React, { Suspense } from 'react';
import { ProcessedContent } from '../data-layer/pull-blog-data';
import styles from '../styles/components/ArticleTags.module.scss';
import TagBadge from './Badge';
import { Stack } from './Layout';

type ArticleTagsProps = Pick<ProcessedContent, 'tags' | 'timeToRead' | 'date'>;

const ArticleTags: React.FC<ArticleTagsProps> = (props) => {
  // const router = useRouter();
  // onClick={() => router.push(`/?tags=${tag}`)}
  const { tags, timeToRead, date } = props;

  return (
    <Stack className={styles.articleTags} aria-hidden='true'>
      {tags.map((tag, index) => (
        <TagBadge key={index}>{tag}</TagBadge>
      ))}
      <TagBadge>{timeToRead} min</TagBadge>
      <TagBadge>
        <Suspense fallback={null}>
          Posted on{' '}
          {new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </Suspense>
      </TagBadge>
    </Stack>
  );
};

export default ArticleTags;
