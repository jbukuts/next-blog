import Head from 'next/head';
import { MDXRemote } from 'next-mdx-remote';
import React, { useMemo, useState } from 'react';
import {
  ArticleTags,
  Heading,
  PrettyCode,
  RelatedArticles,
  TableOfContents,
  Window
} from '../../src/components';
import { RelatedPost } from '../../src/components/RelatedArticles';
import { SharedHeader } from '../../src/components/SEO';
import {
  ProcessedContent,
  getPostContent,
  getPostList,
  getProcessedPostList
} from '../../src/data-layer/pull-blog-data';
import { compressData, decompressData } from '../../src/helpers/compression';
import { SectionHead } from '../../src/helpers/mdast-compile-toc';
import HeadingContext from '../../state/HeadingContext';

import styles from '../../styles/pages/post/[slug].module.scss';

interface BlogPostProps extends ProcessedContent {
  relatedPosts: RelatedPost[];
  tableOfContents: SectionHead[];
  compressedContent: any;
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
    date,
    tableOfContents,
    title,
    desc,
    compressedContent
  } = props;

  const [currentSection, setCurrentSection] = useState('');
  const memoSection = useMemo(
    () => ({ currentSection, setCurrentSection }),
    [currentSection]
  );

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name='description' content={desc} />
        <meta property='og:title' content={title} />
        <meta property='og:type' content='article' />
        <meta property='og:url' content={`https://jbukuts.com/post/${slug}`} />
        <meta property='og:description' content={desc} />
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:title' content={title} />
        <meta name='twitter:description' content={desc} />
        <meta
          property='article:published_time'
          content={new Date(date).toLocaleDateString()}
        />
      </Head>
      <SharedHeader />
      {tableOfContents.length > 0 && (
        <TableOfContents
          tableOfContents={tableOfContents}
          currentSection={currentSection}
        />
      )}
      <HeadingContext.Provider value={memoSection}>
        <Window title={`${slug}.md`} as='main' className={styles.postWrapper}>
          <article
            itemScope
            itemType='https://schema.org/Article'
            className={styles.postContent}>
            <meta
              itemProp='datePublished'
              content={new Date(date).toLocaleDateString()}
            />
            <meta itemProp='author' content='Jake Bukuts' />
            <meta itemProp='publisher' content='jbukuts.com' />
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
        </Window>
      </HeadingContext.Provider>
      <RelatedArticles postList={relatedPosts} currentSlug={slug} />
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

  // get post list for related articles
  const relatedPosts: RelatedPost[] = (await getProcessedPostList({}))
    .map(({ title, slug, date, tags }) => ({ title, slug, date, tags }))
    .filter(({ slug }) => slug !== currentSlug);

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

  Object.keys(props).forEach((key: string) => {
    const sizeOf =
      Buffer.from(JSON.stringify((props as any)[key])).byteLength / 1000;
    console.log(`Size of prop [${key}] is ${sizeOf} kilobytes`);
  });
  console.log(
    `\nTOTAL PROPS SIZE: ${
      Buffer.from(JSON.stringify(props as any)).byteLength / 1000
    }`
  );

  return {
    props
  };
}

export default Article;
