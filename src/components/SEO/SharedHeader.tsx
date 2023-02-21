import Head from 'next/head';
import React from 'react';

const SharedHeader = () => (
  <Head key='shared'>
    <meta name='author' content='Jake Bukuts' />,
    <meta property='og:site_name' content='jbukuts.com' />,
    <meta property='profile:first_name' content='Jake' />,
    <meta property='profile:last_name' content='Bukuts' />,
    <meta property='profile:gender' content='male' />,
    <meta property='profile:username' content='jbukuts' />,
    <meta property='twitter:creator' content='@jbukuts' />,
    <meta
      property='article:author'
      content='https://www.linkedin.com/in/jake-bukuts/'
    />
  </Head>
);

export default SharedHeader;
