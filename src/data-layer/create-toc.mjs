import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { CONTINUE, visit } from 'unist-util-visit';

function compileTOC() {
  const compiler = (tree) => {
    const tableOfContents = [];

    visit(
      tree,
      (node) => {
        const { type, children } = node;
        return type === 'heading' && children[0]?.value;
      },
      (node) => {
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
    return JSON.stringify(tableOfContents);
  };

  Object.assign(this, { Compiler: compiler });
}

export default async function createTOC(rawMarkdown) {
  return JSON.parse(
    String(
      await unified().use(remarkParse).use(compileTOC).process(rawMarkdown)
    )
  );
}
