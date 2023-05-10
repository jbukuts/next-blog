// import 'server-only';

/* eslint-disable camelcase */
/* eslint-disable no-console */
/* eslint-disable import/extensions */
import matter from 'gray-matter';
import { MDXRemoteProps } from 'next-mdx-remote';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypeTruncate from 'rehype-truncate';
import remarkBreaks from 'remark-breaks';
import { PluggableList } from 'unified';
import config from 'config';
import createTOC from './create-toc.mjs';
import { ProcessedContent, RepositoryContent } from './types';

interface GetContentOptions {
  slug?: string;
  components?: MDXRemoteProps['components'];
  fetchOptions?: {
    cache?: 'no-store' | 'force-cache';
    next?: {
      revalidate?: number;
      tags?: string[];
    };
  };
  remarkPlugins?: PluggableList;
  rehypePlugins?: PluggableList;
}

interface GetDataStoreOptions {
  components?: MDXRemoteProps['components'];
  fetchOptions?: GetContentOptions['fetchOptions'];
}

interface ProcessContentOptions {
  plugins: {
    remarkPlugins?: PluggableList;
    rehypePlugins?: PluggableList;
  };
  components: MDXRemoteProps['components'];
}

const { GIT_API_KEY, GIT_USER_NAME, GIT_REPO, GIT_FOLDER } = process.env;
const CHARS_PER_MINUTE = 1150;

// process repository content item
async function processContent(
  item: RepositoryContent,
  options: ProcessContentOptions
): Promise<ProcessedContent> {
  const { plugins, components } = options;

  const { size, path, sha, download_url, content: rawContent, encoding } = item;
  const { remarkPlugins = [], rehypePlugins = [] } = plugins || {};

  const isContentAvailable = rawContent && encoding !== 'none';

  if (!isContentAvailable && !download_url)
    throw new Error('No content in item and no download_url');

  // ideally gray-matter wouldn't be needed
  // but next-mdx-remote can't parse frontmatter from inserted JSX during remark phase
  const { content: rawMarkdown, data: frontmatter } = matter(
    !isContentAvailable
      ? await fetch(download_url as string).then((r) => r.text())
      : Buffer.from(rawContent as string, 'base64').toString()
  );

  const { tags, desc, date } = frontmatter;

  const tableOfContents = await createTOC(rawMarkdown);
  const timeToRead = Math.ceil(size / CHARS_PER_MINUTE);

  const { content } = await compileMDX({
    source: rawMarkdown,
    options: {
      parseFrontmatter: true,
      scope: { timeToRead, tags, date },
      mdxOptions: {
        format: 'mdx',
        remarkPlugins: [...remarkPlugins, remarkBreaks],
        rehypePlugins
      }
    },
    components
  });

  const slug = path.split('/').slice(-1)[0].split('.')[0];

  return {
    title: tableOfContents[0]?.title || '',
    tags: (tags as string[]) || [],
    content,
    date: new Date((date as string) || '1-01-2001').toISOString(),
    tableOfContents,
    desc: desc as string,
    slug,
    path,
    timeToRead,
    hash: sha
  };
}

// source content from repository
export async function getContent(
  options: GetContentOptions
): Promise<ProcessedContent | ProcessedContent[]> {
  const {
    slug,
    components = {},
    fetchOptions = {},
    ...plugins
  } = options || {};

  const path = slug ? `${GIT_FOLDER}/${slug}.md` : GIT_FOLDER;
  const apiURL = `https://api.github.com/repos/${GIT_USER_NAME}/${GIT_REPO}/contents/${path}`;

  const data: RepositoryContent | RepositoryContent[] = await fetch(apiURL, {
    ...fetchOptions,
    ...(slug ? {} : { next: { ...fetchOptions.next, tags: [config.listTag] } }),
    headers: {
      authorization: `Bearer ${GIT_API_KEY}`,
      contentType: 'application/vnd.github.v3+json'
    }
  }).then((r: Response) => {
    if (r.status !== 200) throw new Error(`Slug **${slug}** does not exist!`);
    return r.json();
  });

  if (Array.isArray(data))
    return Promise.all(
      data.map((item) => processContent(item, { plugins, components }))
    );

  return processContent(data, { plugins, components });
}

// get the data store as object map
export async function getDataStore(
  options: GetDataStoreOptions | void
): Promise<Record<string, ProcessedContent>> {
  const { components = {}, fetchOptions = {} } = options || {};

  const storeList = (await getContent({
    fetchOptions,
    components,
    rehypePlugins: [[rehypeTruncate, { maxChars: 300 }]]
  })) as ProcessedContent[];

  const storeMap = storeList.reduce((acc: any, curr: any) => {
    acc[curr.slug] = curr;
    return acc;
  }, {});

  return storeMap;
}

// get data store as sorted list
export async function getDataStoreSorted(
  options: GetDataStoreOptions | void
): Promise<ProcessedContent[]> {
  const storeMap = await getDataStore(options);

  return Object.values(storeMap).sort(
    (a: any, b: any) => -1 * a.date.localeCompare(b.date)
  );
}

// update single path in data store
export async function updateDataStore(options: any) {
  const { slug } = options;
  return slug;
}
