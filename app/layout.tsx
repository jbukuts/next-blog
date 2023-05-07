import { Metadata } from 'next';
import React from 'react';
import '@/styles/globals.scss';
import { GlobalLayout } from '@/components/index';
import profile from 'profile';

const {
  siteTitle,
  description,
  siteURI,
  image,
  username,
  jobTitle,
  firstName,
  lastName
} = profile;

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
    title: siteTitle,
    description,
    url: origin,
    siteName: siteTitle,
    images: image,
    locale: 'en-US',
    type: 'website'
  },
  twitter: {
    card: 'summary',
    title: siteTitle,
    site: origin,
    description,
    creator: `@${username}`,
    images: image
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
