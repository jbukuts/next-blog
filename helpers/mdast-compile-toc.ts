import { visit } from 'unist-util-visit';

export interface SectionHead {
  tagName: string;
  title: string;
  id: string;
}

// eslint-disable-next-line no-unused-vars
export default function mdastCompileToc(this: any) {
  /** @type {import('unified').CompilerFunction<Node, string>} */
  const compiler = (tree: any) => {
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
          title: value,
          id: value
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '')
        });
      }
    );

    return JSON.stringify(tableOfContents);
  };

  Object.assign(this, { Compiler: compiler });
}
