import { CompilerFunction } from 'unified';
import { Node } from 'unist';
import { CONTINUE, visit } from 'unist-util-visit';
import { SectionHead } from './types';

// parses AST into a table of contents
// eslint-disable-next-line no-unused-vars
export default function mdastCompileToc(this: any) {
  const compiler: CompilerFunction<Node, string> = (tree: any) => {
    const tableOfContents: SectionHead[] = [];

    visit(
      tree,
      (node: any) => {
        const { type, children } = node;
        return type === 'heading' && children[0]?.value;
      },
      (node: any) => {
        const { depth, children } = node;
        const { value } = children[0];
        tableOfContents.push({
          tagName: `h${depth}`,
          depth,
          title: value,
          id: value
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '')
        });

        return CONTINUE;
      }
    );

    return JSON.stringify(tableOfContents.slice(1));
  };

  Object.assign(this, { Compiler: compiler });
}
