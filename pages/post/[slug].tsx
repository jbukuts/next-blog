import cx from 'classnames';
import { GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote';
import React, { useContext, useEffect, useMemo } from 'react';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import {
  ArticleTags,
  Heading,
  Main,
  PrettyCode,
  RelatedArticles,
  SmartLink,
  StructuredBlogData,
  TableOfContents
} from '@/components/index';
import { RelatedPost } from '@/components/RelatedArticles/RelatedArticles';
import {
  getContent,
  getDataStore,
  getDataStoreSorted
} from '@/data-layer/data-layer.mjs';
import { ProcessedContent } from '@/data-layer/index';
import { SectionHead } from '@/data-layer/types';
import { useCurrentHeading } from '@/hooks/index';
import logger from 'logger';
import vsTheme from 'public/code-themes/vscode.json';
import { compressData, decompressData } from 'src/helpers/compression';
import { remarkInsertJSXAfterHeader } from 'src/plugins';
import TitleContext from 'src/state/TitleContext';
import styles from './[slug].module.scss';

const FlexContainer = dynamic(
  () =>
    import('../../src/components/article-helpers').then(
      (mod) => mod.FlexContainer
    ),
  {
    ssr: false
  }
);

interface BlogPostProps extends Omit<ProcessedContent, 'content'> {
  relatedPosts: RelatedPost[];
  tableOfContents: SectionHead[];
  compressedContent: string;
}

const components: MDXRemoteProps['components'] = {
  FlexContainer,
  ArticleTags,
  code: PrettyCode,
  h1: Heading.H1,
  h2: Heading.H2,
  h3: Heading.H3,
  a: SmartLink
} as any;

const { headerHeight } = styles;

const MDXContent = React.forwardRef<HTMLElement, MDXRemoteProps>(
  (props, ref) => (
    <article ref={ref} className={cx(styles.postContent)}>
      <MDXRemote {...props} components={components} />
    </article>
  )
);

const BlogPostPage = (props: BlogPostProps) => {
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

  const [_, setCurrentTitle] = useContext(TitleContext);
  const inflatedContent = useMemo(
    () => decompressData(compressedContent),
    [compressedContent]
  );
  const currentHeadingId = useCurrentHeading(
    'h1[id],h2[id],h3[id],h4[id],h5[id]',
    {
      threshold: [0, 1],
      rootMargin: `-${headerHeight} 0px -90% 0px`
    }
  );

  useEffect(() => {
    setCurrentTitle(title);
  }, [title, setCurrentTitle]);

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
      <RelatedArticles postList={relatedPosts} />
      <Main className={styles.postWrapper}>
        <MDXContent {...inflatedContent} />
      </Main>
      {tableOfContents.length > 0 && (
        <TableOfContents
          tableOfContents={tableOfContents}
          currentSection={currentHeadingId}
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

  const keys: string[] = Object.keys(getDataStore());

  return {
    paths: keys.map((slug) => ({
      params: { slug }
    })),
    fallback: 'blocking'
  };
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { params } = context;

  if (!params?.slug) return { notFound: true };

  const pageSlug = params.slug as string;

  logger.info(`Creating static props for slug: *${pageSlug}*`);
  logger.info('Getting full post-list for related post');

  // get post list for related articles
  const dataStore = getDataStoreSorted();
  const relatedPosts: RelatedPost[] = dataStore
    .map((item: any) => ({
      title: item.title,
      slug: item.slug,
      date: item.date,
      tags: item.tags,
      timeToRead: item.timeToRead
    }))
    .filter(({ slug }) => slug !== pageSlug);

  logger.info(`Getting processed content for slug: *${pageSlug}*`);

  const processedContent = await getContent({
    slug: pageSlug,
    remarkPlugins: [remarkInsertJSXAfterHeader],
    rehypePlugins: [
      [rehypePrettyCode, { theme: vsTheme }],
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        { behavior: 'wrap', test: ['h2', 'h3', 'h4', 'h5', 'h6'] }
      ]
    ]
  });

  const { tags, content, timeToRead, date, tableOfContents, title, desc } =
    processedContent as any;

  // compress content
  const compressedContent = compressData(content);

  const props: BlogPostProps = {
    slug: pageSlug,
    relatedPosts,
    tags,
    tableOfContents,
    timeToRead,
    date,
    title,
    desc,
    compressedContent
  };

  logger.info(`Calculating props size of page *${params.slug}*`);

  const sizeOf = (item: any) =>
    Buffer.from(JSON.stringify(item)).byteLength / 1000;

  Object.entries(props).forEach((item: [string, object]) => {
    const [key, value] = item;
    logger.info(`Size of prop [${key}] is ${sizeOf(value)} kilobytes`);
  });
  logger.info(`Size of prop [content] is ${sizeOf(content)} kilobytes`);
  logger.info(`TOTAL PROPS SIZE: ${sizeOf(props)}`);

  return {
    props,
    revalidate: 43200
  };
};

export default BlogPostPage;
