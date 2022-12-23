import { h } from "hastscript";
import { visit } from "unist-util-visit";

const DEF_BUTTON_CLASS = "rehype-copy-button";
const DEF_CONT_CLASS = "rehype-code-container";

interface CopyCodeOptions {
  buttonClassName?: string;
  containerClassName?: string;
}

// makes use of existing wrapper
const rehypeCopyCode = (
  options: CopyCodeOptions
  // eslint-disable-next-line arrow-body-style
) => {
  const { buttonClassName = DEF_BUTTON_CLASS } = options;

  return (tree: any) => {
    visit(tree, "element", (node: any, index: any, parent: any) => {
      if (
        node.tagName === "div" &&
        "data-rehype-pretty-code-fragment" in node.properties
      ) {
        parent.children[index].children.push({
          type: "element",
          tagName: "button",
          properties: {
            className: [`${buttonClassName}`],
            type: "button",
          },
          children: [{ type: "text", value: "Copy" }],
        });
      }
    });
  };
};

// creates a new wrapper around the code
const rehypeCopyCodeWrapper = (
  options: CopyCodeOptions
  // eslint-disable-next-line arrow-body-style
) => {
  const {
    buttonClassName = DEF_BUTTON_CLASS,
    containerClassName = DEF_CONT_CLASS,
  } = options;

  return (tree: any) => {
    visit(tree, "element", (node: any, index: any, parent: any) => {
      if (
        node.tagName === "div" &&
        "data-rehype-pretty-code-fragment" in node.properties
      ) {
        const container = [];
        container.push(parent.children[index].children);
        container.push({
          type: "element",
          tagName: "button",
          properties: {
            className: [`${buttonClassName}`],
            type: "button",
          },
          children: [{ type: "text", value: "Copy" }],
        });

        // eslint-disable-next-line no-param-reassign
        parent.children[index] = h(`div.${containerClassName}`, container);
      }
    });
  };
};

export default rehypeCopyCode;
export { rehypeCopyCodeWrapper };
