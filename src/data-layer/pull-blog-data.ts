/**
 * pull-blog-data.ts
 * Helper functions meant to be used in order to parse .md/.mdx files as jsx
 * that are sourced from a Github repository
 */
import matter from 'gray-matter';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import nodeFetch from 'node-fetch';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeTruncate from 'rehype-truncate';
import remarkBreaks from 'remark-breaks';
import remarkParse from 'remark-parse';
import { PluggableList, Preset, unified } from 'unified';
import remarkStringifyMdast, {
  SectionHead
} from '../helpers/mdast-compile-toc';
import remarkSectionWrapper from '../plugins/rehype/rehype-section-wrapper';
import remarkInsertJSXAfterHeader from '../plugins/remark/remark-insert-jsx';
import codeTheme from './code-theme';
import { RepositoryContent, getRepositoryContent } from './git-api-calls';

const { GIT_USER_NAME, GIT_REPO, GIT_FOLDER, GIT_API_KEY } = process.env;

const CHARS_PER_MINUTE = 1150;

const CODE_THEME = codeTheme;

export interface ProcessContentOptions {
  repoContent: RepositoryContent;
  remarkPlugins?: PluggableList;
  rehypePlugins?: PluggableList;
}

export interface ProcessedContent {
  date: string;
  title: string;
  slug: string;
  timeToRead: number;
  tags: string[];
  content: MDXRemoteSerializeResult;
  tableOfContents: SectionHead[];
  desc: string;
}

export interface GetPostOptions {
  slug: string;
  remarkPlugins?: PluggableList;
  rehypePlugins?: PluggableList;
}

/**
 * Helper function that create table of contents from raw markdown string
 * @param {string} rawMarkdown - Raw Markdown content string
 */
async function createTableOfContents(
  rawMarkdown: string
): Promise<SectionHead[]> {
  return JSON.parse(
    String(
      await unified()
        .use(remarkParse)
        .use(remarkStringifyMdast as Preset)
        .process(rawMarkdown)
    )
  );
}

/**
 * Helper functions that returns list of files from Github repo
 * @param {string} filterType - Files to filter by from the repository
 */
async function getPostList(filterType = '.md'): Promise<RepositoryContent[]> {
  return (
    getRepositoryContent({
      owner: GIT_USER_NAME as string,
      repo: GIT_REPO as string,
      path: `${GIT_FOLDER}`,
      apiKey: GIT_API_KEY as string
    }) as Promise<RepositoryContent[]>
  ).then((r) =>
    r.filter(({ name, type }) => type === 'file' && name.endsWith(filterType))
  );
}

/**
 * Process content from repo contents API using next-mdx-remote.
 * @param {ProcessContentOptions} options - Options for getting single post.
 * @param {RepositoryContent} options.repoContent - Content object return from the repository contents Github REST API.
 * @param {PluggableList} options.remarkPlugins - List of remarks plugins to apply when parsing Markdown to HTML.
 * @param {PluggableList} options.rehypePugins - List of rehype plugins to apply when parsing Markdown to HTML.
 */
async function processContent(
  options: ProcessContentOptions
): Promise<ProcessedContent> {
  const { repoContent, remarkPlugins = [], rehypePlugins = [] } = options;
  const {
    download_url: downloadURL,
    size,
    name,
    content: encodedContent,
    encoding
  } = repoContent;

  const rawContent: string =
    !encodedContent || encoding === 'none'
      ? await nodeFetch(downloadURL).then((r) => r.text())
      : Buffer.from(encodedContent, 'base64').toString();

  const { data: frontmatter, content: matterContent } = matter(rawContent);
  const { tags, desc, date } = frontmatter as any;
  const timeToRead = Math.ceil(size / CHARS_PER_MINUTE);

  const tableOfContents = await createTableOfContents(matterContent);

  const content = await serialize(matterContent, {
    mdxOptions: {
      remarkPlugins: [...remarkPlugins, remarkBreaks],
      rehypePlugins,
      format: 'mdx'
    },
    scope: { timeToRead, tags, date },
    parseFrontmatter: false
  });

  return {
    title: tableOfContents[0].title,
    slug: name.substring(0, name.indexOf('.')),
    timeToRead,
    tags,
    content,
    date: new Date(date).toISOString(),
    tableOfContents,
    desc
  };
}

/**
 * Get content by slug for file from Github repository.
 * @param {GetPostOptions} options - Options for getting single post.
 * @param {string} options.slug - File extension to pull from the Github repository.
 * @param {PluggableList} options.remarkPlugins - List of remarks plugins to apply when parsing Markdown to HTML.
 * @param {PluggableList} options.rehypePlugins - List of rehype plugins to apply when parsing Markdown to HTML.
 */
async function getPostContent(
  options: Partial<GetPostOptions>
): Promise<ProcessedContent> {
  const { slug, remarkPlugins = [], rehypePlugins = [] } = options;

  const repoContent = (await getRepositoryContent({
    owner: GIT_USER_NAME as string,
    repo: GIT_REPO as string,
    path: `${GIT_FOLDER}/${slug}.md`,
    apiKey: GIT_API_KEY as string
  })) as RepositoryContent;

  return processContent({
    repoContent,
    remarkPlugins: [remarkInsertJSXAfterHeader, ...remarkPlugins],
    rehypePlugins: [
      [rehypePrettyCode, { theme: CODE_THEME }],
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        { behavior: 'wrap', test: ['h2', 'h3', 'h4', 'h5', 'h6'] }
      ],
      ...rehypePlugins,
      remarkSectionWrapper
    ]
  });
}

/**
 * Get content by slug for file from Github repository.
 * @param {Omit<GetPostOptions, 'slug'>} options - Options for getting single post.
 * @param {PluggableList} options.remarkPlugins - List of remarks plugins to apply when parsing Markdown to HTML.
 * @param {PluggableList} options.rehypePugins - List of rehype plugins to apply when parsing Markdown to HTML.
 */
async function getProcessedPostList(
  options: Omit<GetPostOptions, 'slug'>
): Promise<ProcessedContent[]> {
  const { remarkPlugins = [], rehypePlugins = [] } = options;

  const repoContentList = await getPostList();

  if (repoContentList.length === 0)
    throw new Error(
      'No posts pulled from Github Contents API. Invalid API Key?'
    );

  return Promise.all(
    repoContentList.map((repoContent) =>
      processContent({
        repoContent,
        remarkPlugins,
        rehypePlugins: [[rehypeTruncate, { maxChars: 300 }], ...rehypePlugins]
      })
    )
  ).then((list) => list.sort((a, b) => -1 * a.date.localeCompare(b.date)));
}

export { getPostContent, getProcessedPostList, getPostList };
