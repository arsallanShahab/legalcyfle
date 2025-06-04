import {
  documentToHtmlString,
  RenderNode,
} from "@contentful/rich-text-html-renderer";
import { BLOCKS, Document, INLINES } from "@contentful/rich-text-types";

type Node = {
  nodeType: string;
  data: {
    uri: string;
    target: {
      fields: {
        title: string;
        slug: string;
        file: {
          contentType: string;
          url: string;
        };
      };
    };
  };
  content: {
    data: {
      uri: string;
      target: {
        fields: {
          title: string;
          file: {
            url: string;
          };
        };
      };
    };
    content: { value: string }[];
    value: string;
    marks: { type: string }[];
    nodeType: string;
  }[];
};

type BlogContentProps = {
  data: {
    fields: {
      body: {
        nodeType: string;
        data: {};
        content: Node[];
      };
    };
  };
};

{/* <div class="ad_infeed">
  <ins
    class="adsbygoogle"
    style="display:block; text-align:center;"
    data-ad-layout="in-article"
    data-ad-format="fluid"
    data-ad-client="ca-pub-5892936530350741"
    data-ad-slot="5536160107"
  ></ins>
  <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
</div>; */}

const renderNode: { [key: string]: (node: Node) => string } = {
  [BLOCKS.EMBEDDED_ASSET]: (node) => {
    const { title, file } = node.data.target.fields;
    const mimeType = file.contentType;
    const mimeGroup = mimeType.split("/")[0];

    switch (mimeGroup) {
      case "image":
        return `<img src="${file.url}" class="blog_image" alt="${title}" />`;
      case "application":
        return `<a href="${file.url}">${title}</a>`;
      default:
        return `<a href="${file.url}">${title}</a>`;
    }
  },
  [INLINES.EMBEDDED_ENTRY]: (node) => {
    const { title, slug } = node.data.target.fields;
    return `<a href="/${slug}">${title}</a>`;
  },
  [INLINES.HYPERLINK]: (node) => {
    return `<a href="${node.data.uri}">${node.content[0].value}</a>`;
  },
  [BLOCKS.QUOTE]: (node) => {
    return `<div class="ad_infeed"><ins class="adsbygoogle"
     style="display:block; text-align:center;"
     data-ad-slot="4210005765"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script></div><div class="ad_infeed"><ins class="adsbygoogle"
     style="display:block; text-align:center;"
     data-ad-layout="in-article"
     data-ad-format="fluid"
     data-ad-client="ca-pub-5892936530350741"
     data-ad-slot="5536160107"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script></div>`;
  },
  [BLOCKS.PARAGRAPH]: (node) => {
    return `<p class="blog_paragraph">
      ${node.content
        .map((n) => {
          if (n.nodeType === "text") {
            if (n.marks.length > 0) {
              return `<strong>${n.value}</strong>`;
            }
            return n.value;
          }
          if (n.nodeType === INLINES.HYPERLINK) {
            return `<a class="blog_link" href="${n.data.uri}">${n.content[0].value}</a>`;
          }
          if (n.nodeType === BLOCKS.EMBEDDED_ASSET) {
            return `<img src="${n.data.target.fields.file.url}" alt="${n.data.target.fields.title}" />`;
          }
        })
        .join("")}
    </p>`;
  },
  [BLOCKS.HEADING_1]: (node: Node) =>
    `<h1 class="blog_heading_h1">${node.content[0].value}</h1>
  `,
  [BLOCKS.HEADING_2]: (node: Node) =>
    `<h2 class="blog_heading_h2">${node.content[0].value}</h2>`,
  [BLOCKS.HEADING_3]: (node: Node) =>
    `<h3 class="blog_heading_h3">${node.content[0].value}</h3>`,
  [BLOCKS.HEADING_4]: (node: Node) =>
    `<h4 class="blog_heading_h4">${node.content[0].value}</h4>`,
  [BLOCKS.HEADING_5]: (node: Node) =>
    `<h5 class="blog_heading_h5">${node.content[0].value}</h5>`,
  [BLOCKS.HEADING_6]: (node: Node) =>
    `<h6 class="blog_heading_h6">${node.content[0].value}</h6>`,
};

const BlogContent = (props: BlogContentProps) => {
  const htmlString = documentToHtmlString(
    props.data.fields.body as unknown as Document,
    {
      renderNode: renderNode as RenderNode & {
        [key: string]: (node: Node) => string;
      },
    },
  );

  return (
    <div
      className="blog_container"
      dangerouslySetInnerHTML={{ __html: htmlString }}
    ></div>
  );
};

export default BlogContent;
