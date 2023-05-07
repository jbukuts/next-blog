import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

interface RevalidateResponse {
  status: number;
  revalidated: boolean;
  message?: string;
  slug_updated?: string;
  now: number;
}

const { REVALIDATE_SECRET } = process.env;

export const dynamic = 'force-dynamic';

function sendError(status: number, message: string) {
  const response: RevalidateResponse = {
    status,
    message,
    revalidated: false,
    now: Date.now()
  };

  return new NextResponse(JSON.stringify(response), {
    headers: { 'Content-Type': 'application/json' }
  });
}

// eslint-disable-next-line import/prefer-default-export
export async function POST(request: NextRequest) {
  const { token, slug } = await request.json();

  if (!REVALIDATE_SECRET)
    return sendError(500, 'No secret available. Cannot authenticate');

  if (!slug) return sendError(400, 'No token in request body');

  const splitSlug = slug.split('/').filter((item: string) => item);

  if (splitSlug.length !== 2)
    return sendError(400, 'Slug is expected to reference a post only');

  if (token !== REVALIDATE_SECRET) return sendError(401, 'Invalid token');

  console.log(`path to revalidate **${splitSlug[1]}**`);

  revalidateTag(splitSlug[1]);
  revalidateTag('post-list');
  revalidatePath(slug);
  revalidatePath('/rss.xml');

  const response: RevalidateResponse = {
    status: 200,
    revalidated: true,
    slug_updated: slug,
    now: Date.now()
  };

  return new NextResponse(JSON.stringify(response), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
