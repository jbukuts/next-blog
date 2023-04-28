import { NextApiRequest, NextApiResponse } from 'next';
import logger from '../../logger';
import GitHubCMS from '../../src/data-layer';

const { REVALIDATE_SECRET } = process.env;

const CMSInstance = GitHubCMS.getInstance();

function sendError(res: NextApiResponse, code: number, message: string) {
  return res.status(code).send({ message });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    body: { token, slug }
  } = req;

  if (method?.toUpperCase() !== 'POST')
    return sendError(res, 400, 'Invalid method');

  if (token !== REVALIDATE_SECRET) return sendError(res, 401, 'Invalid token');

  try {
    logger.info('Attempting to revalidate static pages');

    const pathList = slug ? [slug] : await CMSInstance.getChangedFiles();

    logger.info('Paths sourced from repository');

    CMSInstance.clearData();

    if (pathList.length > 0) {
      await Promise.all(
        pathList.map(async (path) => {
          await res.revalidate(path);
          logger.info(`Revalidated ${path}`);
        })
      );

      logger.info('Paths revalidated!');

      await res.revalidate('/');
    }

    logger.info('Static pages revalidated successfully!');
    return res.json({ revalidated: true, pages_updated: pathList });
  } catch (err) {
    logger.error('There was an error revalidating pages', err);
    CMSInstance.clearSha();
    return sendError(res, 500, 'Error revalidating');
  }
}
