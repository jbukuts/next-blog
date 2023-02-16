import { fromMarkdown } from 'mdast-util-from-markdown';
import { mdxFromMarkdown } from 'mdast-util-mdx';
import { mdxjs } from 'micromark-extension-mdxjs';
import { Node, visit } from 'unist-util-visit';

/*
 * Replaces the default rehype-pretty-code wrapper div with React element
 */
function rehypePrettyCodeWrapper() {
  return (tree: any) => {
    visit(
      tree,
      (node: Node) => {
        const { tagName, properties } = node as any;
        return (
          tagName === 'div' && 'data-rehype-pretty-code-fragment' in properties
        );
      },
      (_, index) => {
        if (index === null) return;
        const { children: currentChildren } = tree;

        const { children: jsxChildren }: any = fromMarkdown('<PrettyCode/>', {
          extensions: [mdxjs()],
          mdastExtensions: [mdxFromMarkdown()]
        });

        currentChildren[index] = {
          ...jsxChildren[0],
          children: currentChildren[index as number].children
        };
      }
    );
    return tree;
  };
}

export default rehypePrettyCodeWrapper;
