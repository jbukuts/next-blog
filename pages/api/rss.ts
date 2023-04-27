import { Feed } from 'feed';
import { NextApiRequest, NextApiResponse } from 'next';
import logger from '../../logger';
import profile from '../../profile';
import { ProcessedContent, getProcessedContent } from '../../src/data-layer';

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

export default async function rss(_req: NextApiRequest, res: NextApiResponse) {
  try {
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

    ((await getProcessedContent()) as ProcessedContent[]).forEach(
      (postItem) => {
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
      }
    );

    const xml = feed.rss2();
    return res.status(200).send(xml);
  } catch (err: unknown) {
    logger.error({
      err: {
        message: 'There was an error generating RSS XML document',
        err
      }
    });

    return res
      .status(500)
      .send('There was an internal error. Try again later.');
  }
}
