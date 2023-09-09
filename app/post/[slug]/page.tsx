/* eslint-disable no-console */
// import path from 'path';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemoteProps } from 'next-mdx-remote';
import React, { Suspense } from 'react';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import { Article, WithContext } from 'schema-dts';
import {
  ArticleTags,
  FlexContainer,
  PrettyCode,
  SmartLink
} from '@/components/article-helpers/index';
import { RelatedArticles, TableOfContents } from '@/components/index';
import { Main } from '@/components/Layout/index';
import { Heading } from '@/components/UI/index';
import { getContent, getDataStore } from '@/data-layer/data-layer';
import { ProcessedContent } from '@/data-layer/types';
import styles from '@/styles/pages/[slug].module.scss';
import { openGraphData, twitterData } from 'app/shared-metadata';
import profile from 'profile';
import { rehypeSectionWrapper, remarkInsertJSXAfterHeader } from 'src/plugins';

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
  siteURI
} = profile;

const origin = `https://${siteURI}`;

export const dynamic = 'force-static';
// export const revalidate = config.revalidateLength;
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

  console.log(`Static page slugs: ${keys}`);

  return keys.map((slug) => ({
    slug
  }));
}

// compile to static html
async function getPageData(pageSlug: string) {
  try {
    console.log(`Pulling page data for *${pageSlug}*`);

    const processedContent = (await getContent({
      fetchOptions: { next: { tags: [pageSlug] } },
      slug: pageSlug,
      components,
      remarkPlugins: [remarkInsertJSXAfterHeader],
      rehypePlugins: [
        rehypeHighlight,
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          { behavior: 'wrap', test: ['h2', 'h3', 'h4', 'h5', 'h6'] }
        ],
        [rehypeSectionWrapper, { className: styles.postSection }]
      ]
    })) as ProcessedContent;
    return processedContent;
  } catch (err: any) {
    console.error(err);
    return notFound();
  }
}

export async function generateMetadata({
  params
}: BlogPostProps): Promise<Metadata> {
  const { title, desc: description } = await getPageData(params.slug);

  const pageUrl = `/post/${params.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
      types: {
        'application/rss+xml': `${origin}/rss`
      }
    },
    openGraph: {
      ...openGraphData,
      title,
      description,
      url: pageUrl,
      type: 'article',
      siteName: siteTitle
    },
    twitter: {
      ...twitterData,
      title,
      site: origin,
      description
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
