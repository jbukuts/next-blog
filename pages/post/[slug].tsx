import { MDXRemote } from 'next-mdx-remote';
import React, { useMemo, useState } from 'react';
import {
  ArticleTags,
  Heading,
  PrettyCode,
  RelatedArticles,
  TableOfContents,
  Window
} from '../../components/index';
import { RelatedPost } from '../../components/RelatedArticles/RelatedArticles';
import { SectionHead } from '../../helpers/mdast-compile-toc';
import {
  ProcessedContent,
  getPostContent,
  getPostList,
  getProcessedPostList
} from '../../helpers/pull-blog-data';
import HeadingContext from '../../state/HeadingContext';
import styles from '../../styles/pages/Article.module.scss';

interface PageContext {
  params: {
    slug: string;
  };
}

interface BlogPostProps extends Omit<ProcessedContent, 'name'> {
  relatedPosts: RelatedPost[];
  tableOfContents: SectionHead[];
}

const components = {
  ArticleTags,
  PrettyCode,
  h1: Heading.H1,
  h2: Heading.H2,
  h3: Heading.H3
} as any;

const Article = (props: BlogPostProps) => {
  const {
    slug,
    relatedPosts,
    content,
    timeToRead,
    tags,
    date,
    tableOfContents
  } = props;

  const [currentSection, setCurrentSection] = useState('');
  const memoSection = useMemo(
    () => ({ currentSection, setCurrentSection }),
    [currentSection]
  );

  return (
    <HeadingContext.Provider value={memoSection}>
      {tableOfContents.length > 0 && (
        <TableOfContents
          tableOfContents={tableOfContents}
          currentSection={currentSection}
        />
      )}
      <Window className={styles.wrapper} title={`${slug}.md`} wrapper='main'>
        <article className={styles.content}>
          <MDXRemote
            {...content}
            components={components}
            scope={{ timeToRead, tags, date }}
          />
        </article>
      </Window>
      <RelatedArticles postList={relatedPosts} currentSlug={slug} />
    </HeadingContext.Provider>
  );
};

export async function getStaticPaths() {
  const { SKIP_BUILD_STATIC_GENERATION } = process.env;
  if (SKIP_BUILD_STATIC_GENERATION) {
    return {
      paths: [],
      fallback: 'blocking'
    };
  }

  // pull in all contents from repo folder
  const contentList: Array<any> = await getPostList();

  // filter slugs as the file names and remove non-markdown files
  return {
    paths: contentList.map(({ name }) => ({
      params: { slug: name.slice(0, -3) }
    })),
    fallback: 'blocking'
  };
}

export async function getStaticProps(context: PageContext) {
  const {
    params: { slug: currentSlug }
  } = context;

  // get post list for related articles
  const relatedPosts: RelatedPost[] = (await getProcessedPostList({})).map(
    ({ title, slug, date, tags }) => ({ title, slug, date, tags })
  );

  // get the html and frontmatter data for given slug
  const { tags, content, timeToRead, date, tableOfContents } =
    await getPostContent({
      slug: currentSlug
    });

  return {
    props: {
      slug: currentSlug,
      relatedPosts,
      tags,
      tableOfContents,
      content,
      timeToRead,
      date
    } as BlogPostProps
  };
}

export default Article;
