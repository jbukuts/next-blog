import matter, { GrayMatterFile } from "gray-matter";
import DOMPurify from "isomorphic-dompurify";
import rehypeFormat from "rehype-format";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkBreaks from "remark-breaks";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { Plugin, unified } from "unified";
import rehypeCopyCode from "./rehype-pretty-copy-button";

const {
  GIT_API_URL,
  GIT_USER_NAME,
  GIT_REPO,
  GIT_FOLDER,
  GIT_API_KEY,
  POST_EXCERPT_BREAK,
} = process.env;

const CHARS_PER_MINUTE = 1150;

export interface BlogItem {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  content?: string;
  slug?: string;
}

export interface FrontMatter {
  data: {
    title: string;
    tags: Array<string>;
  };
  content: string;
  excerpt?: any;
}

export interface PostItem {
  slug: string;
  content: string;
  title: string;
  tags: Array<string>;
  timeToRead: number;
}

export interface PluginObject {
  plugin: Function;
  options?: object;
}

// create HTML string from markdown string
const buildHTML = async (
  content: string,
  remarkPlugins: Array<PluginObject> = [],
  rehypePlugins: Array<PluginObject> = []
) => {
  const pluginStack: Array<PluginObject> = [
    { plugin: remarkParse },
    ...remarkPlugins,
    { plugin: remarkRehype },
    { plugin: rehypeFormat },
    ...rehypePlugins,
    { plugin: rehypeStringify },
  ];

  const output = pluginStack.reduce((acc, curr) => {
    const { plugin, options } = curr as PluginObject;
    acc.use(plugin as Plugin, { ...options });
    return acc;
  }, unified());

  return DOMPurify.sanitize(String(await output.process(content)));
};

// gets a list of content matching file type from repo
const getPostList = async (type: string = ".md") =>
  (
    (await fetch(
      `${GIT_API_URL}/repos/${GIT_USER_NAME}/${GIT_REPO}/contents/${GIT_FOLDER}`,
      {
        headers: {
          authorization: `Bearer ${GIT_API_KEY}`,
          contentType: "application/vnd.github.v3+json",
        },
      }
    ).then((r) => r.json())) as Array<BlogItem>
  )
    .filter(({ name }) => name.endsWith(type))
    .map((item) => ({ ...item, slug: item.name.slice(0, -type.length) }));

// get frontmatter and html for given markdown file by slug
const getPostContent = async (
  slug: string,
  isExcerpt: boolean = false,
  rehypePugins: Array<PluginObject> = []
) => {
  // pull in raw content from git api
  const { size, download_url: downloadURL } = (await fetch(
    `${GIT_API_URL}/repos/${GIT_USER_NAME}/${GIT_REPO}/contents/${GIT_FOLDER}/${slug}.md`,
    {
      headers: {
        authorization: `Bearer ${GIT_API_KEY}`,
        contentType: "application/vnd.github.v3+json",
      },
    }
  ).then((r) => r.json())) as BlogItem;

  const rawContent: string = await fetch(downloadURL).then((r) => r.text());

  const { content, data, excerpt } = matter(rawContent, {
    excerpt: true,
    excerpt_separator: POST_EXCERPT_BREAK,
  }) as GrayMatterFile<string>;

  const { title, tags } = data as FrontMatter["data"];

  // parse as HTML
  const htmlString: any = await buildHTML(
    isExcerpt ? (excerpt as string) : content,
    [{ plugin: remarkBreaks }],
    [
      {
        plugin: rehypePrettyCode,
        options: {
          theme: "github-light",
        },
      },
      {
        plugin: rehypeCopyCode,
      },
      { plugin: rehypeSlug },
      ...rehypePugins,
    ]
  );

  return {
    slug,
    content: htmlString,
    title,
    tags,
    timeToRead: Math.ceil(size / CHARS_PER_MINUTE),
  } as PostItem;
};

export { getPostList, getPostContent };
