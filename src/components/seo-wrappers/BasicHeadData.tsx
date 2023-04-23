import Head from 'next/head';
import React from 'react';
import profile from '../../../profile';

const {
  image: defaultImage,
  description: defaultDescription,
  username,
  siteTitle,
  siteURI
} = profile;

interface DataProps {
  title: string;
  description: string;
  datePublished: string;
  relativeUrl: string;
  timeRequired: string;
}

const BasicHeadData = (
  props: Partial<Omit<DataProps, 'timeRequired' | 'datePublished'>>
) => {
  const { title, description, relativeUrl } = props;
  const { origin } = (typeof window !== 'undefined' && window?.location) || {
    origin: `https://${siteURI}`
  };
  const fullURL = `${origin}${relativeUrl || ''}`;
  const finalTitle = title || siteTitle;
  const finalDesc = description || defaultDescription;

  return (
    <Head key='basic-head-data'>
      <title>{finalTitle}</title>
      <link rel='icon' href='/favicon.ico' />
      <link rel='canonical' href={fullURL} />
      <meta name='description' content={finalDesc} />

      <meta property='og:title' content={finalTitle} />
      <meta property='og:url' content={fullURL} />
      <meta property='og:type' content='website' />
      <meta property='og:description' content={finalDesc} />

      <meta name='twitter:card' content='summary' />
      <meta name='twitter:title' content={finalTitle} />
      <meta name='twitter:description' content={finalDesc} />
      <meta name='twitter:image' content={`${origin}${defaultImage}`} />
      <meta name='twitter:site' content={origin} />
      <meta name='twitter:creator' content={`@${username}`} />
    </Head>
  );
};

export default BasicHeadData;
