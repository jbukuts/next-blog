import { Metadata } from 'next';
import React from 'react';
import '@/styles/globals.scss';
import profile from 'profile';
import GlobalLayout from './GlobalLayout';

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
const imageURL = `${origin}${image}`;

export const metadata: Metadata = {
  title: {
    template: `${firstName} ${lastName} - %s`,
    default: jobTitle
  },
  alternates: {
    canonical: origin
  },
  openGraph: {
    title: siteTitle,
    description,
    url: origin,
    siteName: siteTitle,
    images: [{ url: imageURL }],
    locale: 'en-US',
    type: 'website'
  },
  twitter: {
    card: 'summary',
    title: siteTitle,
    site: origin,
    description,
    creator: `@${username}`,
    images: [imageURL]
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
