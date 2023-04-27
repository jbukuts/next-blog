import React, { Suspense } from 'react';
import { ProcessedContent } from '../../../data-layer';
import { Badge, Stack } from '../../UI';
import styles from './ArticleTags.module.scss';

type ArticleTagsProps = Pick<ProcessedContent, 'tags' | 'timeToRead' | 'date'>;

const ArticleTags = (props: ArticleTagsProps) => {
  // const router = useRouter();
  // onClick={() => router.push(`/?tags=${tag}`)}
  const { tags, timeToRead, date } = props;

  return (
    <Stack className={styles.articleTags} spacing='xs' aria-hidden='true'>
      {tags.map((tag, index) => (
        <Badge key={index}>{tag}</Badge>
      ))}
      <Badge>{timeToRead} min</Badge>
      <Badge>
        <Suspense fallback={null}>
          Posted on{' '}
          {new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </Suspense>
      </Badge>
    </Stack>
  );
};

export default ArticleTags;
