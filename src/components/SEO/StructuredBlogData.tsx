import Head from 'next/head';
import React from 'react';
import profile from '../../../profile';

interface StructuredBlogSchema {
  headline: string;
  name: string;
  image: string;
  description: string;
  datePublished: string;
  url: string;
  timeRequired: string;
  publisher: string;
  author: {
    '@type': string;
    name: string;
    url: string;
    alumniOf: string;
    givenName: string;
    familyName: string;
    gender: string;
    jobTitle: string;
  };
}

const { siteURI } = profile;

const StructuredBlogData = (data: StructuredBlogSchema) => {
  const { name, description, url, image } = data;

  return (
    <Head key='stuctured-blog-data'>
      <title>{name}</title>
      <meta name='description' content={description} />

      <meta property='og:title' content={name} />
      <meta property='og:type' content='article' />
      <meta property='og:url' content={url} />
      <meta property='og:description' content={description} />

      <meta name='twitter:card' content='summary' />
      <meta name='twitter:title' content={name} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={image} />
      <meta name='twitter:site' content={`https://${siteURI}`} />
      <meta name='twitter:creator' content='@jbukuts' />

      <script
        type='application/ld+json'
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'http://schema.org/',
            '@type': 'Article',
            ...data
          })
        }}
      />
    </Head>
  );
};

export default StructuredBlogData;
