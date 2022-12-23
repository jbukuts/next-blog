import React, { useEffect } from "react";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import Window from "../../components/Window/Window";
import {
  BlogItem,
  PluginObject,
  getPostContent,
  getPostList,
} from "../../helpers/pull-blog-data";
import styles from "../../styles/pages/Article.module.scss";

interface PageContext {
  params: {
    slug: string;
  };
}

interface BlogPostProps {
  content: string;
  slug: string;
}

const Article = (props: BlogPostProps) => {
  const { content, slug } = props;

  useEffect(() => {
    const copyText = (evt: unknown) => {
      const text = (
        evt as React.SyntheticEvent<HTMLButtonElement>
      ).currentTarget.parentNode?.querySelector("pre");
      navigator.clipboard.writeText(text?.textContent || "");
    };

    const copyButtons = Array.from(
      document.getElementsByClassName("rehype-copy-button")
    );

    copyButtons.forEach((button) => button.addEventListener("click", copyText));

    return () =>
      copyButtons.forEach((button) =>
        button.removeEventListener("click", copyText)
      );
  }, []);

  return (
    <Window className={styles.wrapper} title={`${slug}.md`}>
      <article
        className={styles.content}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </Window>
  );
};

export async function getStaticPaths() {
  // pull in all contents from repo folder
  const contentList: Array<BlogItem> = await getPostList();

  // filter slugs as the file names and remove non-markdown files
  return {
    paths: contentList.map(({ name }) => ({
      params: { slug: name.slice(0, -3) },
    })),
    fallback: false,
  };
}

export async function getStaticProps(context: PageContext) {
  const {
    params: { slug },
  } = context;

  // get the html and frontmatter data for given slug
  const { content } = await getPostContent(slug, false, [
    { plugin: rehypeAutolinkHeadings, options: { behavior: "wrap" } },
  ] as Array<PluginObject>);

  return {
    props: { content, slug } as BlogPostProps,
  };
}

export default Article;
