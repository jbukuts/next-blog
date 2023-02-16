import matter, { GrayMatterFile } from 'gray-matter';
import DOMPurify from 'isomorphic-dompurify';
import rehypeFormat from 'rehype-format';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { Plugin, unified } from 'unified';

interface PluginObject {
  plugin: Function;
  options?: object;
}

/**
 * Creates a unified parser.
 * @param {PluginObject[]} remarkPlugins - List of remark plugins to apply.
 * @param {PluginObject[]} remarkPlugins - List of rehype plugins to apply.
 */
const buildParser = (
  remarkPlugins: PluginObject[] = [],
  rehypePlugins: PluginObject[] = []
) => {
  const pluginStack: Array<PluginObject> = [
    { plugin: remarkParse },
    ...remarkPlugins,
    { plugin: remarkRehype },
    { plugin: rehypeFormat },
    ...rehypePlugins,
    { plugin: rehypeStringify }
  ];

  const output = pluginStack.reduce((acc, curr) => {
    const { plugin, options } = curr as PluginObject;
    acc.use(plugin as Plugin, { ...options });
    return acc;
  }, unified());

  return output;
};

/**
 * create HTML string from markdown string.
 * @param {string} content - Markdown string content to convert to HTML string.
 * @param {PluginObject[]} remarkPlugins - List of rehype plugins to apply.
 * @param {PluginObject[]} remarkPlugins - List of rehype plugins to apply.
 */
const buildHTML = async (
  content: string,
  remarkPlugins: PluginObject[] = [],
  rehypePlugins: PluginObject[] = []
) => {
  const output = buildParser(remarkPlugins, rehypePlugins);
  return DOMPurify.sanitize(String(await output.process(content)));
};

const parseFrontMatter = (rawMarkdown: string, options: object) => {
  const { content, data, excerpt } = matter(
    rawMarkdown,
    options
  ) as GrayMatterFile<string>;

  return { content, data, excerpt };
};

export { buildHTML, buildParser, parseFrontMatter };
