import cx from 'classnames';
import dynamic from 'next/dynamic';
import { MDXRemote } from 'next-mdx-remote';

import React, { useMemo, useState } from 'react';
import logger from '../../logger';
import {
  ArticleTags,
  Heading,
  PrettyCode,
  RelatedArticles,
  TableOfContents
} from '../../src/components';
import { RelatedPost } from '../../src/components/RelatedArticles';
import { StructuredBlogData } from '../../src/components/SEO';
import {
  ProcessedContent,
  getPostContent,
  getPostList,
  getProcessedPostList
} from '../../src/data-layer/pull-blog-data';
import { compressData, decompressData } from '../../src/helpers/compression';
import { SectionHead } from '../../src/helpers/mdast-compile-toc';
import HeadingContext from '../../src/state/HeadingContext';

import styles from '../../src/styles/pages/post/[slug].module.scss';

const FlexContainer = dynamic(
  () =>
    import('../../src/components/ArticleHelpers').then(
      (mod) => mod.FlexContainer
    ),
  {
    ssr: false
  }
);

interface BlogPostProps extends ProcessedContent {
  relatedPosts: RelatedPost[];
  tableOfContents: SectionHead[];
  compressedContent: any;
}

const components = {
  FlexContainer,
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
    date,
    tableOfContents,
    title,
    desc,
    compressedContent,
    timeToRead
  } = props;

  const [currentSection, setCurrentSection] = useState('');
  const memoSection = useMemo(
    () => ({ currentSection, setCurrentSection }),
    [currentSection]
  );

  const seoData = {
    title,
    description: desc,
    datePublished: new Date(date).toLocaleDateString(),
    timeRequired: `${timeToRead} minutes`,
    relativeUrl: `/post/${slug}`
  };

  return (
    <>
      <StructuredBlogData {...seoData} />
      <RelatedArticles postList={relatedPosts} currentSlug={slug} />
      <HeadingContext.Provider value={memoSection}>
        <article className={cx(styles.postContent, styles.postWrapper)}>
          {useMemo(
            () => (
              <MDXRemote
                {...decompressData(compressedContent)}
                components={components}
              />
            ),
            [compressedContent]
          )}
        </article>
      </HeadingContext.Provider>
      {tableOfContents.length > 0 && (
        <TableOfContents
          tableOfContents={tableOfContents}
          currentSection={currentSection}
        />
      )}
    </>
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

export async function getStaticProps(context: { params: { slug: string } }) {
  const {
    params: { slug: currentSlug }
  } = context;

  logger.info(`Creating static props for slug: *${currentSlug}*`);

  logger.info('Getting full post-list for related post');
  // get post list for related articles
  const relatedPosts: RelatedPost[] = (await getProcessedPostList({}))
    .map(({ title, slug, date, tags, timeToRead }) => ({
      title,
      slug,
      date,
      tags,
      timeToRead
    }))
    .filter(({ slug }) => slug !== currentSlug);

  logger.info(`Getting processed content for slug: *${currentSlug}*`);
  // get the html and frontmatter data for given slug
  const { tags, content, timeToRead, date, tableOfContents, title, desc } =
    await getPostContent({
      slug: currentSlug
    });

  // compress content
  const compressedContent = compressData(content);

  const props = {
    slug: currentSlug,
    relatedPosts,
    tags,
    tableOfContents,
    timeToRead,
    date,
    title,
    desc,
    compressedContent
  };

  logger.info(`Calculating props size of page *${currentSlug}*`);

  Object.keys(props).forEach((key: string) => {
    const sizeOf =
      Buffer.from(JSON.stringify((props as any)[key])).byteLength / 1000;
    logger.info(`Size of prop [${key}] is ${sizeOf} kilobytes`);
  });
  logger.info(
    `TOTAL PROPS SIZE: ${
      Buffer.from(JSON.stringify(props as any)).byteLength / 1000
    }`
  );

  return {
    props
  };
}

export default Article;
