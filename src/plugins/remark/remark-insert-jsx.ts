import { fromMarkdown } from 'mdast-util-from-markdown';
import { mdxFromMarkdown } from 'mdast-util-mdx';
import { mdxjs } from 'micromark-extension-mdxjs';
import { EXIT, visit } from 'unist-util-visit';

/**
 * Inserts JSX element into the abstract syntax tree under the H1 tag
 */
export default function remarkInsertJSXAfterHeader() {
  return (root: any) => {
    const { children } = fromMarkdown(
      '<ArticleTags tags={tags} timeToRead={timeToRead} date={date}/>',
      {
        extensions: [mdxjs()],
        mdastExtensions: [mdxFromMarkdown()]
      }
    );

    visit(
      root,
      (node) => {
        const { type, depth } = node as any;
        return type === 'heading' && depth === 1;
      },
      (_, index) => {
        if (index === null) return EXIT;
        root.children.splice(index + 1, 0, ...children);
        return EXIT;
      }
    );

    return root;
  };
}
