/* eslint-disable import/prefer-default-export */
import { Feed } from 'feed';
import { NextResponse } from 'next/server';
import profile from 'profile';

const {
  siteURI,
  firstName,
  lastName,
  image,
  copyRightYear,
  siteTitle,
  description,
  emailAddress,
  linkedInProfile
} = profile;
const SITE_URL = `https://${siteURI}`;
const FULL_NAME = `${firstName} ${lastName}`;

// export const revalidate = config.revalidateLength;

export async function GET() {
  const feed = new Feed({
    title: siteTitle,
    description,
    id: SITE_URL,
    link: SITE_URL,
    language: 'en',
    image: `${SITE_URL}${image}`,
    favicon: `${SITE_URL}/favicon.ico`,
    copyright: `${copyRightYear} ${FULL_NAME}`,
    feedLinks: {
      json: `${SITE_URL}/json`,
      atom: `${SITE_URL}/atom`
    },
    author: {
      name: FULL_NAME,
      email: emailAddress,
      link: linkedInProfile
    }
  });

  // dynamic import needed or it complains
  const getDataStoreSorted = await import('@/data-layer/data-layer').then(
    (m) => m.getDataStoreSorted
  );

  const postList = await getDataStoreSorted();

  postList.forEach((postItem) => {
    const { title, slug, desc, date, tags } = postItem;

    feed.addItem({
      title,
      id: `${SITE_URL}/post/${slug}`,
      link: `${SITE_URL}/post/${slug}`,
      description: desc,
      date: new Date(date),
      image: `${SITE_URL}${image}`,
      category: tags.map((tag) => ({ name: tag }))
    });
  });

  const xml = feed.rss2();

  return new NextResponse(xml, {
    status: 200,
    headers: { 'Content-Type': 'application/xml' }
  });
}
