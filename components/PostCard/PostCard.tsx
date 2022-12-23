import Link from "next/link";
import React from "react";
import { PostItem } from "../../helpers/pull-blog-data";
import Window from "../Window/Window";

import styles from "./PostCard.module.scss";

// the use of dangerouslySetInnerHTML should be fine
// given we sanitize when pulling data during SSG phase
// meaning no extra bundle size
// plus the content is curated so XSS is a not really a vector
const PostCard = (props: PostItem) => {
  const { content, slug, tags, timeToRead } = props;

  return (
    <Window
      title={`${slug}.md`}
      wrapper={Link}
      wrapperOptions={{ href: `/post/${slug}` }}
      hoverable
      className={styles.wrapper}
    >
      <div
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: content }}
        className={styles.excerpt}
      />
      <div className={styles.tagsContainer}>
        {tags && tags.map((tag, i) => <p key={i}>{tag}</p>)}
        {timeToRead && <p>{timeToRead} min</p>}
      </div>
    </Window>
  );
};

export default PostCard;
