import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const { REVALIDATE_SECRET } = process.env;

function sendError(status: number, message: string) {
  return new NextResponse(message, { status });
}

// eslint-disable-next-line import/prefer-default-export
export async function POST(request: NextRequest) {
  const { token, slug } = await request.json();

  if (token !== REVALIDATE_SECRET) return sendError(401, 'Invalid token');

  revalidatePath(slug);
  revalidateTag('post-list');

  const response = JSON.stringify({
    revalidated: true,
    slug_updated: slug,
    now: Date.now()
  });

  return new NextResponse(response, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
