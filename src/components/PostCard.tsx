import cx from 'classnames';
import NextLink from 'next/link';
import React from 'react';
import { ProcessedContent } from '../data-layer/pull-blog-data';
import TagBadge from './Badge';
import styles from './PostCard.module.scss';
import Window from './Window';

interface PostCardProps
  extends Partial<
    Pick<ProcessedContent, 'tags' | 'slug' | 'date' | 'timeToRead'>
  > {
  children: React.ReactNode;
  tagLine?: string;
  restrictHeight?: boolean;
}

const PostCard = (props: PostCardProps) => {
  const { slug, tags, timeToRead, date, children, tagLine, restrictHeight } =
    props;

  return (
    <Window
      title={`${slug}.md`}
      as={NextLink}
      className={styles.postCard}
      asProps={{ href: `/post/${slug}` }}>
      <div
        className={cx(
          restrictHeight && styles.restrictHeight,
          styles.postCardContent
        )}>
        {children}
      </div>

      <div className={cx(styles.tagList, styles.verticalStack)}>
        <div className={styles.horizontalStack}>
          {tagLine && <TagBadge>{tagLine}</TagBadge>}
          {tags && tags.map((t, index) => <TagBadge key={index}>{t}</TagBadge>)}
        </div>
        <div className={styles.horizontalStack}>
          {date && (
            <TagBadge emoji='📅'>
              {new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </TagBadge>
          )}
          {timeToRead && <TagBadge emoji='⏰'>{timeToRead} min</TagBadge>}
        </div>
      </div>
    </Window>
  );
};

PostCard.defaultProps = {
  tagLine: undefined,
  restrictHeight: true
};

export default PostCard;
