import NextLink from 'next/link';
import React from 'react';
import { ProcessedContent } from '@/data-layer/index';
import { Badge, Stack, Window } from '../UI';
import styles from './PostCard.module.scss';

interface PostCardProps
  extends Partial<
    Pick<ProcessedContent, 'tags' | 'slug' | 'date' | 'timeToRead'>
  > {
  children: React.ReactNode;
  tagLine?: string;
}

const BADGE_SPACING = 'xs';

const PostCard = (props: PostCardProps) => {
  const { slug, tags, timeToRead, date, children, tagLine = undefined } = props;

  return (
    <Window
      title={`${slug}.md`}
      as={NextLink}
      className={styles.postCard}
      asProps={{ href: `/post/${slug}`, title: 'Click to Read' }}>
      <div className={styles.postCardContent}>{children}</div>

      <Stack spacing={BADGE_SPACING} className={styles.tagStack}>
        <Stack spacing={BADGE_SPACING} className={styles.horizontalStack}>
          {tagLine && <Badge>{tagLine}</Badge>}
          {tags && tags.map((t, index) => <Badge key={index}>{t}</Badge>)}
        </Stack>
        <Stack spacing={BADGE_SPACING} className={styles.horizontalStack}>
          {date && (
            <Badge>
              {new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </Badge>
          )}
          {timeToRead && <Badge>{timeToRead} min</Badge>}
        </Stack>
      </Stack>
    </Window>
  );
};

export default PostCard;
