import { Metadata } from 'next';
import React from 'react';
import '@/styles/globals.scss';
import { GlobalLayout } from '@/components/index';
import profile from 'profile';
import { openGraphData, twitterData } from './shared-metadata';

const { siteTitle, description, siteURI, jobTitle, firstName, lastName } =
  profile;

const origin = `https://${siteURI}`;

export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: {
    template: `${firstName} ${lastName} - %s`,
    default: jobTitle
  },
  description,
  alternates: {
    canonical: origin,
    types: {
      'application/rss+xml': `/rss.xml`
    }
  },
  openGraph: {
    ...openGraphData,
    title: siteTitle,
    description,
    url: origin,
    siteName: siteTitle
  },
  twitter: {
    ...twitterData,
    title: siteTitle,
    site: origin,
    description
  }
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang='en' suppressHydrationWarning>
    <body>
      <div id='__next'>
        <GlobalLayout>{children}</GlobalLayout>
      </div>
    </body>
  </html>
);

export default RootLayout;
