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
import createTOC from './create-toc.mjs';
import { ProcessedContent, RepositoryContent } from './types';

interface GetDataStoreOptions {
  components?: MDXRemoteProps['components'];
}

interface GetContentOptions {
  slug?: string;
  components?: MDXRemoteProps['components'];
  remarkPlugins?: PluggableList;
  rehypePlugins?: PluggableList;
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

  // const isWebWorker =
  //   typeof self !== 'undefined' &&
  //   typeof self.WorkerGlobalScope !== 'undefined';

  // const isNode =
  //   'process' in globalThis &&
  //   typeof process !== 'undefined' &&
  //   typeof process.release !== 'undefined' &&
  //   process.release.name === 'node';
  // const isBrowser = isWebWorker || !isNode;

  // console.log(
  //   `THE CURRENT ENV IS NODE: ${isNode}, ${isWebWorker}, ${isBrowser}`
  // );

  const { size, path, sha, download_url, content: rawContent, encoding } = item;
  const { remarkPlugins = [], rehypePlugins = [] } = plugins || {};

  // ideally gray-matter wouldn't be needed
  // but next-mdx-remote can't parse frontmatter from inserted JSX during remark phase
  const { content: rawMarkdown, data: frontmatter } = matter(
    !rawContent || encoding === 'none'
      ? await fetch(download_url as string).then((r) => r.text())
      : Buffer.from(rawContent, 'base64').toString()
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
    title: tableOfContents[0].title,
    tags: tags as string[],
    content,
    date: new Date(date as string).toISOString(),
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
  const { slug, components = {}, ...plugins } = options || {};

  const path = slug ? `${GIT_FOLDER}/${slug}.md` : GIT_FOLDER;
  const apiURL = `https://api.github.com/repos/${GIT_USER_NAME}/${GIT_REPO}/contents/${path}`;

  const data: RepositoryContent | RepositoryContent[] = await fetch(apiURL, {
    // next: { revalidate: 43200 },
    headers: {
      authorization: `Bearer ${GIT_API_KEY}`,
      contentType: 'application/vnd.github.v3+json'
    }
  }).then((r: Response) => r.json());

  if (Array.isArray(data))
    return Promise.all(
      data.map((item) => processContent(item, { plugins, components }))
    );

  return processContent(data, { plugins, components });
}

// get the data store object

export async function getDataStore(
  options: GetDataStoreOptions | void
): Promise<Record<string, ProcessedContent>> {
  const { components = {} } = options || {};

  const storeList = (await getContent({
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
