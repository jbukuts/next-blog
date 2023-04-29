/* eslint-disable import/extensions */
import getConfig from 'next/config.js';
import { serialize } from 'next-mdx-remote/serialize';
import { Octokit } from 'octokit';
import rehypeTruncate from 'rehype-truncate';
import remarkBreaks from 'remark-breaks';
import getSize from '../helpers/get-size.mjs';
import createTOC from './create-toc.mjs';

const { GIT_API_KEY, GIT_USER_NAME, GIT_REPO, GIT_FOLDER } = process.env;
const CHARS_PER_MINUTE = 1150;

const octokit = new Octokit({ auth: GIT_API_KEY });

// process repository content item
async function processContent(item, plugins) {
  // eslint-disable-next-line camelcase
  const { size, path, sha, download_url, content, encoding } = item;
  const { remarkPlugins = [], rehypePlugins = [] } = plugins || {};

  const rawMarkdown =
    !content || encoding === 'none'
      ? await fetch(download_url).then((r) => r.text())
      : Buffer.from(content, 'base64').toString();

  const tableOfContents = await createTOC(rawMarkdown);
  const timeToRead = Math.ceil(size / CHARS_PER_MINUTE);

  const serializedContent = await serialize(rawMarkdown, {
    mdxOptions: {
      remarkPlugins: [remarkBreaks, ...remarkPlugins],
      rehypePlugins,
      format: 'mdx'
    },
    scope: { timeToRead },
    parseFrontmatter: true
  });

  const { tags, desc, date } = serializedContent.frontmatter;
  serializedContent.scope = {
    ...serializedContent.scope,
    ...serializedContent.frontmatter
  };

  const slug = path.split('/').slice(-1)[0].split('.')[0];

  return {
    title: tableOfContents[0].title,
    tags,
    content: serializedContent,
    date: new Date(date).toISOString(),
    tableOfContents,
    desc,
    slug,
    path,
    timeToRead,
    hash: sha
  };
}

// source content from repository
export async function getContent(options) {
  const { slug, ...plugins } = options || {};

  return octokit.rest.repos
    .getContent({
      owner: GIT_USER_NAME,
      repo: GIT_REPO,
      path: slug ? `${GIT_FOLDER}/${slug}.md` : GIT_FOLDER
    })
    .then((response) => {
      const { status, data } = response;
      if (status !== 200) throw new Error('');

      return Array.isArray(data)
        ? Promise.all(data.map((item) => processContent(item, plugins)))
        : processContent(data, plugins);
    });
}

// get the data store object
export function getDataStore() {
  const { serverRuntimeConfig } = getConfig();

  return serverRuntimeConfig.store;
}

export function getDataStoreSorted() {
  const { serverRuntimeConfig } = getConfig();

  return Object.values(serverRuntimeConfig.store).sort(
    (a, b) => -1 * a.date.localeCompare(b.date)
  );
}

// update single path in data store
export async function updateDataStore(options) {
  const { slug } = options;
  const { serverRuntimeConfig } = getConfig();

  try {
    serverRuntimeConfig.store[slug] = await getContent({
      slug,
      rehypePlugins: [[rehypeTruncate.default, { maxChars: 300 }]]
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('There was an error updating data store:', err);
    return false;
  }

  return true;
}

// wrapper to creatae inital data store
export async function withDataLayer(config) {
  const repoData = await getContent({
    rehypePlugins: [[rehypeTruncate.default, { maxChars: 300 }]]
  });

  const intialStore = repoData.reduce((acc, curr) => {
    acc[curr.slug] = curr;
    return acc;
  }, {});

  // eslint-disable-next-line no-console
  console.log(`Data store is ${getSize(intialStore)} kb!`);

  return {
    ...config,
    serverRuntimeConfig: {
      store: intialStore
    }
  };
}
