/* eslint-disable camelcase */
import { NextRequest, NextResponse } from 'next/server';
import dbConnection from '@/data-layer/db-connection';

const { GIT_API_KEY, GIT_USER_NAME, REVALIDATE_SECRET } = process.env;

interface RepositoryData {
  html_url: string;
  topics: string[];
  languages_url: string;
  homepage: string;
}

// helper to send res back to client
function createResponse(
  status: number,
  message: string,
  data?: Record<string, any>
) {
  return new NextResponse(JSON.stringify({ status, message, data }), {
    headers: {
      'Content-Type': 'application/json'
    },
    status
  });
}

// helper to send errors back to client
function sendError(status: number, message: string, error?: any) {
  return createResponse(status, message, { now: Date.now(), error });
}

// helper to wrap repeated code
function gitHubApiCall(url: string) {
  return fetch(url, {
    headers: {
      authorization: `Bearer ${GIT_API_KEY}`,
      'X-GitHub-Api-Version': ' 2022-11-28',
      contentType: 'application/vnd.github.v3+json'
    }
  });
}

// eslint-disable-next-line import/prefer-default-export
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!REVALIDATE_SECRET)
      return sendError(500, 'No secret available. Cannot authenticate');

    if (token !== REVALIDATE_SECRET) return sendError(401, 'Invalid token');

    const projectRows = await dbConnection
      .selectFrom('personal_projects')
      .selectAll()
      .execute();

    const columnsUpdated = await Promise.all(
      projectRows.map(async (row) => {
        const { title, id } = row;

        // grab repo data
        const apiURL = `https://api.github.com/repos/${GIT_USER_NAME}/${title}`;
        const repoData: RepositoryData = await gitHubApiCall(apiURL)
          .then((r) => r.json())
          .catch(() => null);

        if (!repoData) return { id, updated: false, reason: 'repo data error' };

        // grab language data
        const { html_url, topics, languages_url, homepage } = repoData;
        const langs: string[] = await gitHubApiCall(languages_url)
          .then(async (r) => {
            const data = await r.json();
            return Object.keys(data).sort((a, b) => data[b] - data[a]);
          })
          .catch(() => []);

        const updateRow = await dbConnection
          .updateTable('personal_projects')
          .set(() => ({
            url: html_url,
            homepage_url: homepage,
            tags: topics,
            langs
          }))
          .where('id', '=', id)
          .execute();

        return {
          id,
          updated: updateRow[0].numUpdatedRows.toString() === '1'
        };
      })
    );

    return createResponse(200, 'ok', columnsUpdated);
  } catch (e) {
    return sendError(500, 'Internal server error', e);
  }
}
