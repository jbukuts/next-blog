// per the docs (https://nextjs.org/docs/app/building-your-application/optimizing/metadata)

import profile from 'profile';

const { image, username } = profile;

export const openGraphData = {
  images: image,
  locale: 'en-US',
  type: 'website'
};

export const twitterData = {
  card: 'summary',
  creator: `@${username}`,
  images: image
};
