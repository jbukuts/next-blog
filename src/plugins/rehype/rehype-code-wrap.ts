/* eslint-disable no-param-reassign */
import { fromHtml } from 'hast-util-from-html';
import { CONTINUE, visit } from 'unist-util-visit';
// import vsTheme from '../../../public/code-themes/vscode.json'

const shiki = require('shiki');

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
      theme: 'nord'
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
          code({ children: c }: any) {
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
