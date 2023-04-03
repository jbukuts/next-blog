import { h } from 'hastscript';
import { findAfter } from 'unist-util-find-after';
import { visit } from 'unist-util-visit';

const HEADING_TEST = /^h[2-6]$/;

/*
 * Test is node is a heading element
 */
const isHeading = (node: any) => {
  const { type, tagName } = node;
  return type === 'element' && HEADING_TEST.test(tagName);
};

/*
 * Wraps section under heading element into a section tag
 */
export default function remarkSectionWrapper() {
  return (tree: any) => {
    visit(tree, isHeading, (headingNode, startIndex) => {
      const {
        properties: { id }
      } = headingNode;
      const endNode = findAfter(tree, startIndex as number, isHeading);
      const endIndex = tree.children.indexOf(endNode);
      const section = tree.children.slice(
        startIndex,
        endIndex < 0 ? undefined : endIndex
      );
      const sectionWrapper = h(
        'section',
        {
          'aria-labelledby': id
        },
        section
      );
      tree.children.splice(startIndex, section.length, sectionWrapper);
    });
    return tree;
  };
}
