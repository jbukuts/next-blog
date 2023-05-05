/* eslint-disable no-param-reassign */
import { fromHtml } from 'hast-util-from-html';
import hljs from 'highlight.js';
import { CONTINUE, visit } from 'unist-util-visit';

/*
 * Test is node is a heading element
 */
const isCodeBlock = (node: any) => {
  const { type, tagName } = node;
  return type === 'element' && tagName === 'code';
};

/*
 * Wraps section under heading element into a section tag
 */
export default function rehypeHighlight() {
  return async (tree: any) => {
    visit(tree, isCodeBlock, (node: any) => {
      const {
        children,
        properties: { className }
      } = node;
      if (!className) return CONTINUE;

      const lang = className[0].substring('language-'.length);
      const code = children[0].value;

      // This will return an HTML string that represents the provided code.
      const html = hljs.highlight(code, { language: lang }).value;

      const { children: codeChildren } = fromHtml(html, {
        fragment: true
      });

      node.children = codeChildren;
      node.properties = { ...node.properties, 'data-language': lang };

      return CONTINUE;
    });

    return tree;
  };
}
