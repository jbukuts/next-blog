import fs from 'fs';
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
import rehypePrettyCodeWrapper from '../helpers/rehype/rehype-pretty-code-wrapper';
import remarkSectionWrapper from '../helpers/rehype/rehype-section-wrapper';
import remarkInsertJSXAfterHeader from '../helpers/remark/remark-insert-jsx';
import { RepositoryContent, getRepositoryContent } from './git-api-calls';

const { GIT_USER_NAME, GIT_REPO, GIT_FOLDER, GIT_API_KEY } = process.env;

const CHARS_PER_MINUTE = 1150;

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
  tableOfContents?: SectionHead[];
  desc: string;
}

export interface GetPostOptions {
  slug: string;
  remarkPlugins?: PluggableList;
  rehypePlugins?: PluggableList;
}

/*
 * Helper functions that returns list of files from Github repo
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
 * Get content by slug for file from Github repository.
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

  const tableOfContents = JSON.parse(
    String(
      await unified()
        .use(remarkParse)
        .use(remarkStringifyMdast as Preset)
        .process(matterContent)
    )
  ) as SectionHead[];

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
 * @param {PluggableList} options.rehypePugins - List of rehype plugins to apply when parsing Markdown to HTML.
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

  const processedContent = await processContent({
    repoContent,
    remarkPlugins: [remarkInsertJSXAfterHeader, ...remarkPlugins],
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: JSON.parse(
            fs.readFileSync('./public/vscode-default.json', 'utf-8')
          )
        }
      ],
      rehypePrettyCodeWrapper,
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      ...rehypePlugins,
      remarkSectionWrapper
    ]
  });

  return processedContent;
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
  const processedList: ProcessedContent[] = await Promise.all(
    repoContentList.map((repoContent) =>
      processContent({
        repoContent,
        remarkPlugins,
        rehypePlugins: [[rehypeTruncate, { maxChars: 300 }], ...rehypePlugins]
      })
    )
  );

  return processedList;
}

export { getPostContent, getProcessedPostList, getPostList };
