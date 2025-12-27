import {
  Document,
  Block,
  Inline,
  Text,
  BLOCKS,
  INLINES,
  MARKS,
} from "@contentful/rich-text-types";

/**
 * Converts a Contentful Rich Text Document to a Markdown string.
 */
export function richTextToMarkdown(document: Document | null): string {
  if (!document || !document.content) {
    return "";
  }

  return document.content.map((node) => processNode(node)).join("\n\n");
}

function processNode(node: Block | Inline | Text): string {
  switch (node.nodeType) {
    case BLOCKS.PARAGRAPH:
      return processContent(node as Block);

    case BLOCKS.HEADING_1:
      return `# ${processContent(node as Block)}`;

    case BLOCKS.HEADING_2:
      return `## ${processContent(node as Block)}`;

    case BLOCKS.HEADING_3:
      return `### ${processContent(node as Block)}`;

    case BLOCKS.HEADING_4:
      return `#### ${processContent(node as Block)}`;

    case BLOCKS.HEADING_5:
      return `##### ${processContent(node as Block)}`;

    case BLOCKS.HEADING_6:
      return `###### ${processContent(node as Block)}`;

    case BLOCKS.UL_LIST:
      return (node as Block).content
        .map((item) => processListItem(item as Block, "-"))
        .join("\n");

    case BLOCKS.OL_LIST:
      return (node as Block).content
        .map((item, index) => processListItem(item as Block, `${index + 1}.`))
        .join("\n");

    case BLOCKS.QUOTE:
      // Special handling for quotes as they are used for Ads in this project
      return "[[AD_BLOCK]]";

    case BLOCKS.HR:
      return "---";

    case BLOCKS.EMBEDDED_ASSET:
      const asset = node.data?.target?.fields;
      if (asset?.file?.url) {
        return `![${asset.title || "Image"}](${asset.file.url})`;
      }
      return "";

    case INLINES.HYPERLINK:
      return `[${processContent(node as Inline)}](${node.data.uri})`;

    case "text":
      return processText(node as Text);

    default:
      return "";
  }
}

function processListItem(node: Block, prefix: string): string {
  if (node.nodeType === BLOCKS.LIST_ITEM) {
    // List items usually contain paragraphs. We need to handle indentation for nested lists if we were being very robust,
    // but for simple lists, we just take the content.
    const content = node.content
      .map((child) => {
        if (child.nodeType === BLOCKS.PARAGRAPH) {
          return processContent(child as Block);
        }
        // Handle nested lists recursively if needed, but for now let's keep it simple
        return processNode(child);
      })
      .join("\n  ");
    return `${prefix} ${content}`;
  }
  return "";
}

function processContent(node: Block | Inline): string {
  if (!node.content) return "";
  return node.content.map((child) => processNode(child)).join("");
}

function processText(node: Text): string {
  let value = node.value;

  if (node.marks) {
    node.marks.forEach((mark) => {
      switch (mark.type) {
        case MARKS.BOLD:
          value = `**${value}**`;
          break;
        case MARKS.ITALIC:
          value = `*${value}*`;
          break;
        case MARKS.UNDERLINE:
          value = `__${value}__`; // Markdown doesn't standardly support underline, but we can use this convention
          break;
        case MARKS.CODE:
          value = `\`${value}\``;
          break;
      }
    });
  }

  return value;
}
