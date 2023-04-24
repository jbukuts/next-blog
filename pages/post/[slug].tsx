import cx from 'classnames';
import dynamic from 'next/dynamic';
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote';
import React, { useContext, useEffect, useMemo } from 'react';
import logger from '../../logger';
import { RelatedArticles, TableOfContents } from '../../src/components';
import {
  ArticleTags,
  PrettyCode,
  SmartLink
} from '../../src/components/article-helpers';
import { Main } from '../../src/components/Layout';
import { RelatedPost } from '../../src/components/RelatedArticles/RelatedArticles';
import { StructuredBlogData } from '../../src/components/seo-wrappers';
import { Heading } from '../../src/components/UI';
import {
  ProcessedContent,
  getPostContent,
  getPostList,
  getProcessedPostList
} from '../../src/data-layer/pull-blog-data';
import { compressData, decompressData } from '../../src/helpers/compression';
import { SectionHead } from '../../src/helpers/mdast-compile-toc';
import { useCurrentHeading } from '../../src/hooks';
import TitleContext from '../../src/state/TitleContext';
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

  // pull in all contents from repo folder
  const contentList: Array<any> = await getPostList().catch((e: Error) => {
    logger.error(`There was an error getting the post list: ${e}`);
    return [];
  });

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
  const processedContent = await getPostContent({
    slug: currentSlug
  });

  const { tags, content, timeToRead, date, tableOfContents, title, desc } =
    processedContent;

  // compress content
  const compressedContent = compressData(content);

  const props: BlogPostProps = {
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
}

export default BlogPostPage;
