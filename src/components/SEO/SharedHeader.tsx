import Head from 'next/head';
import React from 'react';
import profile from '../../../profile';

const {
  firstName,
  lastName,
  gender,
  username,
  linkedInProfile,
  image,
  siteURI
} = profile;

const SharedHeader = () => {
  const { host, protocol } = (typeof window !== 'undefined' &&
    window.location) || {
    host: siteURI,
    protocol: 'https:'
  };

  return (
    <Head key='shared'>
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta name='author' content={`${firstName} ${lastName}`} />,
      <meta property='og:site_name' content={host} />,
      <meta property='og:locale' content='en_US' />
      <meta property='og:image' content={`${protocol}${host}${image}`} />
      <meta property='profile:first_name' content={firstName} />,
      <meta property='profile:last_name' content={lastName} />,
      <meta property='profile:gender' content={gender} />,
      <meta property='profile:username' content={username} />,
      <meta property='twitter:creator' content={`@${username}`} />,
      <meta property='article:author' content={linkedInProfile} />
    </Head>
  );
};

export default SharedHeader;
