import { NextApiRequest, NextApiResponse } from 'next';
import RSS from 'rss';
import logger from '../../logger';
import profile from '../../profile';
import {
  ProcessedContent,
  getProcessedPostList
} from '../../src/data-layer/pull-blog-data';

const {
  siteURI,
  firstName,
  lastName,
  image,
  copyRightYear,
  siteTitle,
  description
} = profile;
const SITE_URL = `https://${siteURI}`;
const FULL_NAME = `${firstName} ${lastName}`;

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    const feed = new RSS({
      title: siteTitle,
      description,
      feed_url: `${SITE_URL}/rss.xml`,
      site_url: SITE_URL,
      image_url: `${SITE_URL}${image}`,
      managingEditor: FULL_NAME,
      webMaster: FULL_NAME,
      copyright: `${copyRightYear} ${FULL_NAME}`,
      language: 'en',
      categories: ['Tech', 'Programming', 'Computer Science'],
      pubDate: 'May 20, 2012 04:00:00 GMT',
      ttl: 32400
    });
    const postList: ProcessedContent[] = await getProcessedPostList({});

    postList.forEach((postItem) => {
      const { title, slug, desc, date, tags } = postItem;

      feed.item({
        title,
        description: desc,
        url: `${SITE_URL}/post/${slug}`,
        date,
        categories: tags
      });
    });

    const xml = feed.xml();
    res.status(200).send(xml);
  } catch (err: unknown) {
    logger.error({
      err: {
        message: 'There was an error generating RSS XML document',
        err
      }
    });

    res.status(500).send('There was an internal error. Try again later.');
  }
};
