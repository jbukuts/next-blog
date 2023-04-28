/* eslint-disable no-param-reassign */
// import { h } from 'hastscript';
import { fromHtml } from 'hast-util-from-html';
import shiki from 'shiki';
// import { findAfter } from 'unist-util-find-after';
import { CONTINUE, visit } from 'unist-util-visit';
import vsTheme from '../../../public/code-themes/vscode.json';
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
export default function rehypeCodeWrap() {
  return async (tree: any) => {
    const highlighter = await shiki.getHighlighter({
      theme: {
        name: '',
        type: 'light',
        settings: [],
        fg: '',
        bg: '',
        colors: vsTheme.colors
      }
    });

    visit(tree, isCodeBlock, (node: any) => {
      const {
        children,
        properties: { className }
      } = node;
      if (!className) return CONTINUE;

      const lang = className[0].substring('language-'.length);
      const code = children[0].value;

      const tokens = highlighter.codeToThemedTokens(code, lang);

      // This will return an HTML string that represents the provided code.
      const html = shiki.renderToHtml(tokens, {
        bg: 'transparent',
        elements: {
          code({ children: c }) {
            return `${c}`;
          }
        }
      });

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
