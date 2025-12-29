import { BlogEntry } from "@/types/contentful/blog";
import {
  documentToHtmlString,
  RenderNode,
} from "@contentful/rich-text-html-renderer";
import { BLOCKS, Document, INLINES } from "@contentful/rich-text-types";
import { useEffect } from "react";

// Utility functions for social media embeds
const detectSocialMediaUrl = (url: string) => {
  const patterns = {
    instagram:
      /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_-]+)/,
    twitter:
      /(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/,
    youtube:
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
  };

  for (const [platform, pattern] of Object.entries(patterns)) {
    const match = url.match(pattern);
    if (match) {
      return { platform, id: match[1] };
    }
  }
  return null;
};

const createSocialEmbed = (url: string, linkText: string) => {
  const detection = detectSocialMediaUrl(url);

  // External link icon SVG
  const externalLinkIcon = `<svg class="inline-block ml-1 text-gray-400" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.5 3C3.22386 3 3 3.22386 3 3.5C3 3.77614 3.22386 4 3.5 4H7.29289L3.14645 8.14645C2.95118 8.34171 2.95118 8.65829 3.14645 8.85355C3.34171 9.04882 3.65829 9.04882 3.85355 8.85355L8 4.70711V8.5C8 8.77614 8.22386 9 8.5 9C8.77614 9 9 8.77614 9 8.5V3.5C9 3.22386 8.77614 3 8.5 3H3.5Z" fill="currentColor"/>
  </svg>`;

  if (!detection) {
    return `<a class="text-blue-600 hover:text-blue-800 underline decoration-blue-400 underline-offset-2 transition-colors duration-200" href="${url}" rel="noopener noreferrer" target="_blank">${linkText}${externalLinkIcon}</a>`;
  }

  const { platform, id } = detection;

  switch (platform) {
    case "instagram":
      return `
        <div class="my-6 flex justify-center">
          <blockquote class="instagram-media" data-instgrm-permalink="${url}" data-instgrm-version="14" style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);">
            <div style="padding: 16px;">
              <a href="${url}" style="background: #FFFFFF; line-height: 0; padding: 0 0; text-align: center; text-decoration: none; width: 100%;" target="_blank" rel="noopener noreferrer">
                <div style="display: flex; flex-direction: row; align-items: center;">
                  <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div>
                  <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;">
                    <div style="background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div>
                    <div style="background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div>
                  </div>
                </div>
                <div style="padding: 19% 0;"></div>
                <div style="display: block; height: 50px; margin: 0 auto 12px; width: 50px;">
                  <svg width="50px" height="50px" viewBox="0 0 60 60"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-511.000000, -20.000000)" fill="#000000"><g><path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path></g></g></g></svg>
                </div>
                <div style="padding-top: 8px;">
                  <div style="color: #3897f0; font-family: Arial,sans-serif; font-size: 14px; font-style: normal; font-weight: 550; line-height: 18px;">View this post on Instagram</div>
                </div>
              </a>
            </div>
          </blockquote>
          <script async src="//www.instagram.com/embed.js"></script>
        </div>
      `;

    case "twitter":
      return `
        <div class="my-6 flex justify-center">
          <blockquote class="twitter-tweet" data-theme="light">
            <p>Loading tweet...</p>
            <a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>
          </blockquote>
          <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

        </div>
      `;

    case "youtube":
      return `
        <div class="my-6 w-full aspect-video rounded-lg overflow-hidden shadow-sm">
          <div class="relative w-full h-full">
            <iframe 
              class="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/${id}"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
              loading="lazy">
            </iframe>
          </div>
        </div>
      `;

    default:
      return `<a class="text-blue-600 hover:text-blue-800 underline decoration-blue-400 underline-offset-2 transition-colors duration-200" href="${url}" rel="noopener noreferrer" target="_blank">${linkText}</a>`;
  }
};

// Improved text processing for nested content
const processTextContent = (content: any[]): string => {
  return content
    .map((item: any) => {
      if (item.nodeType === "text") {
        let text = item.value;
        if (item.marks && item.marks.length > 0) {
          item.marks.forEach((mark: any) => {
            switch (mark.type) {
              case "bold":
                text = `<strong class="font-bold text-gray-900">${text}</strong>`;
                break;
              case "italic":
                text = `<em class="italic text-gray-800">${text}</em>`;
                break;
              case "underline":
                text = `<u class="decoration-gray-400 underline-offset-2">${text}</u>`;
                break;
              case "code":
                text = `<code class="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-200">${text}</code>`;
                break;
            }
          });
        }
        return text;
      }
      if (item.nodeType === INLINES.HYPERLINK) {
        const linkText = item.content[0]?.value || "Link";
        return createSocialEmbed(item.data.uri, linkText);
      }
      return "";
    })
    .join("");
};

// Improved list processing
const processListContent = (content: any[]): string => {
  return content
    .map((listItem: any) => {
      if (listItem.nodeType === BLOCKS.LIST_ITEM) {
        const itemContent = listItem.content
          .map((block: any) => {
            if (block.nodeType === BLOCKS.PARAGRAPH) {
              return processTextContent(block.content);
            }
            if (block.nodeType === BLOCKS.UL_LIST) {
              return `<ul class="mt-2 ml-4 space-y-1 list-disc text-gray-700">${processListContent(block.content)}</ul>`;
            }
            if (block.nodeType === BLOCKS.OL_LIST) {
              return `<ol class="mt-2 ml-4 space-y-1 list-decimal text-gray-700">${processListContent(block.content)}</ol>`;
            }
            return "";
          })
          .join("");
        return `<li class="pl-1">${itemContent}</li>`;
      }
      return "";
    })
    .join("");
};

type Node = {
  nodeType: string;
  data: {
    uri?: string;
    target?: {
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
  content: any[];
};

type BlogContentProps = {
  data: BlogEntry;
};

const renderNode: { [key: string]: (node: Node) => string } = {
  [BLOCKS.EMBEDDED_ASSET]: (node) => {
    const { title, file } = node.data.target?.fields || {};
    if (!file) return "";

    const mimeType = file.contentType;
    const mimeGroup = mimeType.split("/")[0];

    switch (mimeGroup) {
      case "image":
        return `<figure class="my-6 md:my-8">
          <img src="${file.url}" class="w-full h-auto rounded-lg shadow-sm object-cover" alt="${title || "Image"}" loading="lazy" />
          ${title ? `<figcaption class="mt-2 text-center text-sm text-gray-500 font-lora italic">${title}</figcaption>` : ""}
        </figure>`;
      case "application":
        return `<a href="${file.url}" rel="noopener noreferrer" target="_blank" class="text-blue-600 hover:text-blue-800 underline decoration-blue-400 underline-offset-2 transition-colors duration-200">${title}</a>`;
      default:
        return `<a href="${file.url}" rel="noopener noreferrer" target="_blank" class="text-blue-600 hover:text-blue-800 underline decoration-blue-400 underline-offset-2 transition-colors duration-200">${title}</a>`;
    }
  },

  [INLINES.EMBEDDED_ENTRY]: (node) => {
    const { title, slug } = node.data.target?.fields || {};
    return `<a href="/${slug}" rel="noopener" class="text-blue-600 hover:text-blue-800 underline decoration-blue-400 underline-offset-2 transition-colors duration-200">${title}</a>`;
  },

  [INLINES.HYPERLINK]: (node) => {
    const url = node.data.uri || "";
    const linkText = node.content[0]?.value || "Link";
    return createSocialEmbed(url, linkText);
  },

  [BLOCKS.QUOTE]: () => {
    return `<div class="my-2 flex justify-center overflow-hidden">
      <ins class="adsbygoogle"
        style="display:block; text-align:center; min-width: 250px;"
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-5892936530350741"
        data-ad-slot="5536160107">
      </ins>
      <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
      </script>
    </div>`;
  },

  [BLOCKS.TABLE]: (node) => {
    let headerLabels: string[] = [];

    // First pass: collect header labels
    node.content.forEach((row: any, rowIndex: number) => {
      if (row.nodeType === BLOCKS.TABLE_ROW && rowIndex === 0) {
        headerLabels = row.content.map((cell: any, cellIndex: number) => {
          if (
            cell.nodeType === BLOCKS.TABLE_CELL ||
            cell.nodeType === BLOCKS.TABLE_HEADER_CELL
          ) {
            return (
              processTextContent(cell.content[0]?.content || []) ||
              `Column ${cellIndex + 1}`
            );
          }
          return `Column ${cellIndex + 1}`;
        });
      }
    });

    const tableContent = node.content
      .map((row: any, rowIndex: number) => {
        if (row.nodeType === BLOCKS.TABLE_ROW) {
          const cellsContent = row.content
            .map((cell: any, cellIndex: number) => {
              if (
                cell.nodeType === BLOCKS.TABLE_CELL ||
                cell.nodeType === BLOCKS.TABLE_HEADER_CELL
              ) {
                const cellText = processTextContent(
                  cell.content[0]?.content || [],
                );
                const isHeader =
                  cell.nodeType === BLOCKS.TABLE_HEADER_CELL || rowIndex === 0;
                const dataLabel =
                  headerLabels[cellIndex] || `Column ${cellIndex + 1}`;

                return isHeader
                  ? `<th class="px-4 py-3 text-left text-sm font-bold text-gray-900 bg-gray-50 border-b-2 border-gray-200 font-playfair tracking-wider whitespace-nowrap">${cellText}</th>`
                  : `<td class="px-4 py-3 text-sm text-gray-700 border-b border-gray-100 font-lora" data-label="${dataLabel}">${cellText}</td>`;
              }
              return "";
            })
            .join("");
          return `<tr class="hover:bg-gray-50 transition-colors duration-150">${cellsContent}</tr>`;
        }
        return "";
      })
      .join("");

    return `
      <div class="my-8 w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
          ${tableContent}
        </table>
      </div>
    `;
  },

  [BLOCKS.UL_LIST]: (node) => {
    return `<ul class="list-disc pl-6 mb-6 space-y-2 text-gray-800 font-lora text-base md:text-lg leading-relaxed marker:text-gray-400">${processListContent(node.content)}</ul>`;
  },

  [BLOCKS.OL_LIST]: (node) => {
    return `<ol class="list-decimal pl-6 mb-6 space-y-2 text-gray-800 font-lora text-base md:text-lg leading-relaxed marker:text-gray-400">${processListContent(node.content)}</ol>`;
  },

  [BLOCKS.PARAGRAPH]: (node) => {
    const content = processTextContent(node.content);
    return content
      ? `<p class="mb-5 font-lora text-base md:text-lg leading-7 md:leading-8 text-gray-800 text-justify break-words">${content}</p>`
      : "";
  },

  [BLOCKS.HEADING_1]: (node: Node) => {
    const text = processTextContent(node.content);
    return `<h1 class="mt-10 mb-6 font-playfair font-semibold text-3xl md:text-4xl text-gray-900 leading-tight tracking-tight border-b border-gray-200 pb-4">${text}</h1>`;
  },

  [BLOCKS.HEADING_2]: (node: Node) => {
    const text = processTextContent(node.content);
    return `<h2 class="mt-8 mb-4 font-playfair font-semibold text-2xl md:text-3xl text-gray-900 leading-snug tracking-tight">${text}</h2>`;
  },

  [BLOCKS.HEADING_3]: (node: Node) => {
    const text = processTextContent(node.content);
    return `<h3 class="mt-6 mb-3 font-playfair font-semibold text-xl md:text-2xl text-gray-900 leading-snug">${text}</h3>`;
  },

  [BLOCKS.HEADING_4]: (node: Node) => {
    const text = processTextContent(node.content);
    return `<h4 class="mt-5 mb-2 font-playfair font-semibold text-lg md:text-xl text-gray-900 leading-snug">${text}</h4>`;
  },

  [BLOCKS.HEADING_5]: (node: Node) => {
    const text = processTextContent(node.content);
    return `<h5 class="mt-4 mb-2 font-playfair font-semibold text-base md:text-lg text-gray-900 uppercase tracking-wide">${text}</h5>`;
  },

  [BLOCKS.HEADING_6]: (node: Node) => {
    const text = processTextContent(node.content);
    return `<h6 class="mt-4 mb-2 font-playfair font-semibold text-sm md:text-base text-gray-700 uppercase tracking-wider">${text}</h6>`;
  },

  [BLOCKS.HR]: () => {
    return `<hr class="my-8 border-t border-gray-200" />`;
  },

  // Handle other blocks that should be ignored at the top level
  [BLOCKS.TABLE_ROW]: () => "",
  [BLOCKS.TABLE_CELL]: () => "",
  [BLOCKS.TABLE_HEADER_CELL]: () => "",
  [BLOCKS.LIST_ITEM]: () => "",
};

const BlogContent = ({ data }: BlogContentProps) => {
  useEffect(() => {
    // Load social media embed scripts with better error handling
    const loadSocialScripts = () => {
      try {
        // Instagram
        if (window && (window as any).instgrm) {
          (window as any).instgrm.Embeds.process();
        }

        // Twitter
        if (window && (window as any).twttr) {
          (window as any).twttr.widgets.load();
        }
      } catch (error) {
        console.warn("Error loading social media scripts:", error);
      }
    };

    // Use requestAnimationFrame for better performance
    const loadScripts = () => {
      requestAnimationFrame(loadSocialScripts);
    };

    // Load immediately and also after a short delay
    loadScripts();
    const timer = setTimeout(loadScripts, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!data?.fields?.body) {
    return (
      <div className="w-full max-w-none py-8 text-center font-lora text-gray-500">
        No content available
      </div>
    );
  }

  try {
    const htmlString = documentToHtmlString(
      data.fields.body as unknown as Document,
      {
        renderNode: renderNode as RenderNode,
      },
    );

    return (
      <div
        className="w-full max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlString }}
      />
    );
  } catch (error) {
    console.error("Error rendering blog content:", error);
    return (
      <div className="w-full max-w-none py-8 text-center font-lora text-red-500">
        Error loading content
      </div>
    );
  }
};

export default BlogContent;
