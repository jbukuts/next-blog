import { MDXRemote } from 'next-mdx-remote';
import Link from 'next/link';
import React from 'react';
import { ProcessedContent } from '../../helpers/pull-blog-data';
import Window from '../Window/Window';
import styles from './PostCard.module.scss';

const PostCard = (props: ProcessedContent) => {
  const { content, slug, tags, timeToRead } = props;

  return (
    <Window
      title={`${slug}.md`}
      wrapper={Link}
      wrapperOptions={{ href: `/post/${slug}` }}
      hoverable
      className={styles.wrapper}>
      <div className={styles.excerpt}>
        <MDXRemote {...content} />
      </div>
      <div className={styles.tagsContainer}>
        {tags && tags.map((tag, i) => <p key={i}>{tag}</p>)}
        {timeToRead && <p>{timeToRead} min</p>}
      </div>
    </Window>
  );
};

export default PostCard;
