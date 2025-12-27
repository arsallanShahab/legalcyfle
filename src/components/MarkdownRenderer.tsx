import React, { useEffect } from "react";

type MarkdownRendererProps = {
  content: string;
};

const AdComponent = () => {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
        {},
      );
    } catch (e) {
      console.error("AdSense error", e);
    }
  }, []);

  return (
    <div className="my-2 flex justify-center overflow-hidden">
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center", minWidth: "250px" }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-5892936530350741"
        data-ad-slot="5536160107"
      ></ins>
    </div>
  );
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null;

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let listBuffer: JSX.Element[] = [];
  let inList = false;

  const parseInline = (text: string) => {
    // Simple inline parser for bold, italic, links, images
    // Note: This is a basic implementation and might not handle nested or complex cases perfectly

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    // Regex for different inline elements
    // Image: ![alt](url)
    // Link: [text](url)
    // Bold: **text**
    // Italic: *text*

    const regex =
      /(!\[(.*?)\]\((.*?)\))|(\[(.*?)\]\((.*?)\))|(\*\*(.*?)\*\*)|(\*(.*?)\*)/g;

    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      if (match[1]) {
        // Image
        parts.push(
          <img
            key={match.index}
            src={match[3]}
            alt={match[2]}
            className="my-4 h-auto w-full rounded-lg object-cover shadow-sm"
            loading="lazy"
          />,
        );
      } else if (match[4]) {
        // Link
        parts.push(
          <a
            key={match.index}
            href={match[6]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline decoration-blue-400 underline-offset-2 transition-colors duration-200 hover:text-blue-800"
          >
            {match[5]}
          </a>,
        );
      } else if (match[7]) {
        // Bold
        parts.push(
          <strong key={match.index} className="font-bold text-gray-900">
            {match[8]}
          </strong>,
        );
      } else if (match[9]) {
        // Italic
        parts.push(
          <em key={match.index} className="italic text-gray-800">
            {match[10]}
          </em>,
        );
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  lines.forEach((line, index) => {
    // Headings
    if (line.startsWith("# ")) {
      elements.push(
        <h1
          key={index}
          className="font-playfair mb-6 mt-10 border-b border-gray-200 pb-4 text-3xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl"
        >
          {parseInline(line.substring(2))}
        </h1>,
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={index}
          className="font-playfair mb-4 mt-8 text-2xl font-bold leading-snug tracking-tight text-gray-900 md:text-3xl"
        >
          {parseInline(line.substring(3))}
        </h2>,
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3
          key={index}
          className="font-playfair mb-3 mt-6 text-xl font-semibold leading-snug text-gray-900 md:text-2xl"
        >
          {parseInline(line.substring(4))}
        </h3>,
      );
    } else if (line.startsWith("#### ")) {
      elements.push(
        <h4
          key={index}
          className="font-playfair mb-2 mt-5 text-lg font-semibold leading-snug text-gray-900 md:text-xl"
        >
          {parseInline(line.substring(5))}
        </h4>,
      );
    } else if (line.startsWith("- ")) {
      // List Item
      if (!inList) {
        inList = true;
        listBuffer = [];
      }
      listBuffer.push(
        <li key={index} className="pl-1">
          {parseInline(line.substring(2))}
        </li>,
      );
    } else if (line.trim() === "[[AD_BLOCK]]") {
      // Ad Block
      if (inList) {
        elements.push(
          <ul
            key={`list-${index}`}
            className="font-lora mb-6 list-disc space-y-2 pl-6 text-base leading-relaxed text-gray-800 marker:text-gray-400 md:text-lg"
          >
            {listBuffer}
          </ul>,
        );
        listBuffer = [];
        inList = false;
      }
      elements.push(<AdComponent key={index} />);
    } else if (line.trim() === "") {
      // Empty line, flush list if needed
      if (inList) {
        elements.push(
          <ul
            key={`list-${index}`}
            className="font-lora mb-6 list-disc space-y-2 pl-6 text-base leading-relaxed text-gray-800 marker:text-gray-400 md:text-lg"
          >
            {listBuffer}
          </ul>,
        );
        listBuffer = [];
        inList = false;
      }
    } else {
      // Paragraph
      if (inList) {
        elements.push(
          <ul
            key={`list-${index}`}
            className="font-lora mb-6 list-disc space-y-2 pl-6 text-base leading-relaxed text-gray-800 marker:text-gray-400 md:text-lg"
          >
            {listBuffer}
          </ul>,
        );
        listBuffer = [];
        inList = false;
      }
      elements.push(
        <p
          key={index}
          className="font-lora mb-5 break-words text-justify text-base leading-7 text-gray-800 md:text-lg md:leading-8"
        >
          {parseInline(line)}
        </p>,
      );
    }
  });

  // Flush remaining list
  if (inList) {
    elements.push(
      <ul
        key="list-end"
        className="font-lora mb-6 list-disc space-y-2 pl-6 text-base leading-relaxed text-gray-800 marker:text-gray-400 md:text-lg"
      >
        {listBuffer}
      </ul>,
    );
  }

  return <div className="w-full max-w-none">{elements}</div>;
};

export default MarkdownRenderer;
