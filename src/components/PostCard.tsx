import NextLink from 'next/link';
import React, { Suspense } from 'react';
import { ProcessedContent } from '../data-layer/pull-blog-data';
import styles from '../styles/components/PostCard.module.scss';
import TagBadge from './Badge';
import Window from './Window';

interface PostCardProps
  extends Partial<
    Pick<ProcessedContent, 'tags' | 'slug' | 'date' | 'timeToRead'>
  > {
  children: React.ReactNode;
  tagLine?: string;
}

const PostCard = (props: PostCardProps) => {
  const { slug, tags, timeToRead, date, children, tagLine } = props;

  return (
    <Window
      title={`${slug}.md`}
      as={NextLink}
      className={styles.postCard}
      asProps={{ href: `/post/${slug}`, title: 'Click to Read' }}>
      <div className={styles.postCardContent}>{children}</div>

      <div className={styles.tagStack}>
        <div className={styles.horizontalStack}>
          {tagLine && <TagBadge>{tagLine}</TagBadge>}
          {tags && tags.map((t, index) => <TagBadge key={index}>{t}</TagBadge>)}
        </div>
        <div className={styles.horizontalStack}>
          {date && (
            <TagBadge>
              <Suspense fallback={null}>
                {new Date(date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </Suspense>
            </TagBadge>
          )}
          {timeToRead && <TagBadge>{timeToRead} min</TagBadge>}
        </div>
      </div>
    </Window>
  );
};

PostCard.defaultProps = {
  tagLine: undefined
};

export default PostCard;
