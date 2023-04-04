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

interface DataProps {
  title: string;
  description: string;
  datePublished: string;
  relativeUrl: string;
  timeRequired: string;
}

const {
  image: defaultImage,
  description: defaultDescription,
  firstName,
  lastName,
  username,
  gender,
  linkedInProfile,
  almaMater,
  siteTitle,
  jobTitle,
  siteURI
} = profile;

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

const StructuredBlogData = (data: DataProps) => {
  const { title, description, datePublished, relativeUrl, timeRequired } = data;
  const { protocol, host } = (typeof window !== 'undefined' &&
    window?.location) || {
    protocol: 'https:',
    host: siteURI
  };

  const seoData: StructuredBlogSchema = {
    headline: title || siteTitle,
    name: title || siteTitle,
    description: description || defaultDescription,
    datePublished,
    publisher: host,
    url: `${protocol}//${host}${relativeUrl}`,
    timeRequired,
    image: `${protocol}${host}${defaultImage}`,
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
      <BasicHeadData
        title={seoData.name}
        description={seoData.description}
        relativeUrl={relativeUrl}
      />
      <Head key='structured-blog-data'>
        <meta property='og:type' content='article' />
        <script
          type='application/ld+json'
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'http://schema.org/',
              '@type': 'Article',
              ...seoData
            })
          }}
        />
      </Head>
    </>
  );
};

export { BasicHeadData };
export default StructuredBlogData;
