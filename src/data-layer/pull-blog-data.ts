/**
 * pull-blog-data.ts
 * Helper functions meant to be used in order to parse .md/.mdx files as jsx
 * that are sourced from a Github repository
 */
import { serialize } from 'next-mdx-remote/serialize';
import nodeFetch from 'node-fetch';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeTruncate from 'rehype-truncate';
import remarkBreaks from 'remark-breaks';
import remarkParse from 'remark-parse';
// eslint-disable-next-line no-unused-vars
import shiki from 'shiki';
import { PluggableList, Preset, unified } from 'unified';
import vsTheme from '../../public/code-themes/vscode.json';
import remarkSectionWrapper from '../plugins/rehype/rehype-section-wrapper';
import remarkInsertJSXAfterHeader from '../plugins/remark/remark-insert-jsx';
import GitHubCMS from './git-cms';
import compileAsTOC, { SectionHead } from './mdast-compile-toc';
import { ProcessedContent, RepositoryContent } from './types';

const { GIT_FOLDER, GIT_API_KEY, GIT_USER_NAME, GIT_REPO } = process.env;
const CHARS_PER_MINUTE = 1150;
const CODE_THEME = vsTheme;

interface GetPostOptions {
  slug?: string;
  remarkPlugins?: PluggableList;
  rehypePlugins?: PluggableList;
}

interface ProcessContentOptions extends Omit<GetPostOptions, 'slug'> {
  repoContent: RepositoryContent;
}

GitHubCMS.createInstance({
  token: GIT_API_KEY as string,
  owner: GIT_USER_NAME as string,
  repo: GIT_REPO as string,
  path: GIT_FOLDER as string
});

const CMSInstance = GitHubCMS.getInstance();

/**
 * Helper function that create table of contents from raw markdown string
 * @param {string} rawMarkdown - Raw Markdown content string
 */
async function createTOC(rawMarkdown: string): Promise<SectionHead[]> {
  return JSON.parse(
    String(
      await unified()
        .use(remarkParse)
        .use(compileAsTOC as Preset)
        .process(rawMarkdown)
    )
  );
}

/**
 * Process content from repo contents API using next-mdx-remote.
 * @param {ProcessContentOptions} options - Options for getting single post.
 * @param {RepositoryContent} options.repoContent - Content object return from the repository contents Github REST API.
 * @param {PluggableList} options.remarkPlugins - List of remarks plugins to apply when parsing Markdown to HTML.
 * @param {PluggableList} options.rehypePlugins - List of rehype plugins to apply when parsing Markdown to HTML.
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
      ? await nodeFetch(downloadURL as string).then((r) => r.text())
      : Buffer.from(encodedContent, 'base64').toString();

  const tableOfContents = await createTOC(rawContent);
  const timeToRead = Math.ceil(size / CHARS_PER_MINUTE);

  const content = await serialize(rawContent, {
    mdxOptions: {
      remarkPlugins: [...remarkPlugins, remarkBreaks],
      rehypePlugins,
      format: 'mdx'
    },
    scope: { timeToRead },
    parseFrontmatter: true
  });

  const { tags, desc, date } = content.frontmatter as any;
  content.scope = { ...content.scope, ...content.frontmatter };

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
 * Get processed content for file(s) from Github repository.
 * @param {GetPostOptions} options - Options for getting single post.
 * @param {string} options.slug - File extension to pull from the Github repository.
 * @param {PluggableList} options.remarkPlugins - List of remarks plugins to apply when parsing Markdown to HTML.
 * @param {PluggableList} options.rehypePlugins - List of rehype plugins to apply when parsing Markdown to HTML.
 */
async function getProcessedContent(
  options: Partial<GetPostOptions> | void
): Promise<ProcessedContent | ProcessedContent[]> {
  const { slug, remarkPlugins = [], rehypePlugins = [] } = options || {};

  const repoContent = await CMSInstance.getRepoContent(
    slug ? { path: `${slug}.md` } : {}
  );

  if (Array.isArray(repoContent))
    return Promise.all(
      repoContent.map((contentItem) =>
        processContent({
          repoContent: contentItem,
          remarkPlugins,
          rehypePlugins: [[rehypeTruncate, { maxChars: 300 }], ...rehypePlugins]
        })
      )
    ).then((list) => list.sort((a, b) => -1 * a.date.localeCompare(b.date)));

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

export default getProcessedContent;
