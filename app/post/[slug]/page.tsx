import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemoteProps } from 'next-mdx-remote';
import React, { Suspense } from 'react';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
// import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import { Article, WithContext } from 'schema-dts';
import ArticleTags from '@/components/article-helpers/ArticleTags';
import FlexContainer from '@/components/article-helpers/FlexContainer';
import PrettyCode from '@/components/article-helpers/PrettyCode';
import SmartLink from '@/components/article-helpers/SmartLink';
import Main from '@/components/Layout/Main';
import RelatedArticles from '@/components/RelatedArticles/RelatedArticles';
import TableOfContents from '@/components/TableOfContents';
import Heading from '@/components/UI/Heading';
import { getContent, getDataStore } from '@/data-layer/data-layer';
import { ProcessedContent } from '@/data-layer/types';
import styles from '@/styles/pages/[slug].module.scss';
import logger from 'logger';
import profile from 'profile';
// import vsTheme from 'public/code-themes/vscode.json';
import { remarkInsertJSXAfterHeader } from 'src/plugins';

interface BlogPostProps {
  params: { slug: string };
}

const {
  image: defaultImage,
  description: defaultDescription,
  firstName,
  lastName,
  gender,
  linkedInProfile,
  almaMater,
  siteTitle,
  jobTitle,
  siteURI,
  image,
  username
} = profile;

const origin = `https://${siteURI}`;

export const dynamic = 'force-static';
export const fetchCache = 'force-cache';
export const dynamicParams = true;

const components: MDXRemoteProps['components'] = {
  FlexContainer,
  ArticleTags,
  code: PrettyCode,
  a: SmartLink,
  h1: Heading.H1,
  h2: Heading.H2,
  h3: Heading.H3
} as any;

export async function generateStaticParams() {
  const keys: string[] = Object.keys(await getDataStore());

  return keys.map((slug) => ({
    slug
  }));
}

async function getPageData(pageSlug: string) {
  try {
    logger.info(`Getting page data for: *${pageSlug}*`);

    const processedContent = (await getContent({
      slug: pageSlug,
      components,
      remarkPlugins: [remarkInsertJSXAfterHeader],
      rehypePlugins: [
        // [rehypePrettyCode, { theme: vsTheme }],
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          { behavior: 'wrap', test: ['h2', 'h3', 'h4', 'h5', 'h6'] }
        ]
      ]
    })) as ProcessedContent;

    logger.info(processedContent.title);

    return processedContent;
  } catch (err: any) {
    logger.error(err);
    return notFound();
  }
}

export async function generateMetadata({
  params
}: BlogPostProps): Promise<Metadata> {
  const { title, desc: description } = await getPageData(params.slug);

  const imageUrl = `${origin}/${image}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${origin}/post/${params.slug}`,
      siteName: siteTitle,
      images: [{ url: imageUrl }],
      locale: 'en-US',
      type: 'article'
    },
    twitter: {
      card: 'summary',
      title,
      site: origin,
      description,
      creator: `@${username}`,
      images: [imageUrl]
    }
  };
}

const BlogPostPage = async ({ params }: BlogPostProps) => {
  const { tableOfContents, content, title, desc, timeToRead, date, slug } =
    await getPageData(params.slug);
  const RecentPosts = await RelatedArticles({ currentSlug: params.slug });

  const jsonLd: WithContext<Article> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title || siteTitle,
    name: title || siteTitle,
    description: desc || defaultDescription,
    datePublished: new Date(date).toLocaleDateString(),
    publisher: siteURI,
    url: `https://${siteURI}/post/${slug}`,
    timeRequired: `${timeToRead} minutes`,
    image: `https:/${siteURI}${defaultImage}`,
    author: {
      '@type': 'Person',
      name: `${firstName} ${lastName}`,
      url: linkedInProfile,
      givenName: firstName,
      familyName: lastName,
      gender,
      alumniOf: almaMater,
      jobTitle
    }
  };

  return (
    <>
      <script
        type='application/ld+json'
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {RecentPosts}
      <Main className={styles.postWrapper}>
        <article className={styles.postContent}>{content}</article>
      </Main>
      {tableOfContents.length > 0 && (
        <Suspense>
          <TableOfContents
            tableOfContents={tableOfContents}
            articleTitle={title}
          />
        </Suspense>
      )}
    </>
  );
};

export default BlogPostPage;
