import { NextApiRequest, NextApiResponse } from 'next';
import logger from '../../logger';

const { REVALIDATE_SECRET } = process.env;

function sendError(res: NextApiResponse, code: number, message: string) {
  return res.status(code).send({ revalidated: false, message });
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

  if (!slug) return sendError(res, 400, 'slug required');

  if (token !== REVALIDATE_SECRET) return sendError(res, 401, 'Invalid token');

  try {
    logger.info(`Attempting to revalidate static page: ${slug}`);

    await res.revalidate(slug);
    await res.revalidate('/');

    logger.info('Static page revalidated successfully!');
    return res.json({ revalidated: true, page_updated: slug });
  } catch (err) {
    logger.error('There was an error revalidating pages', err);

    return sendError(res, 500, 'Error revalidating');
  }
}
