import BlogContent from "@/components/Blog";
import { formatImageLink } from "@/lib/utils";
import { BlogEntry } from "@/types/contentful/blog";
import Image from "next/image";
import React from "react";

interface ArticleContentProps {
  data: BlogEntry;
  thumbnail: string;
}

const ArticleContent: React.FC<ArticleContentProps> = ({ data, thumbnail }) => {
  return (
    <article className="article-content mt-4 md:mt-8" itemProp="articleBody">
      {/* Hero Image */}
      <div className="relative mb-6 w-full overflow-hidden rounded-xl shadow-sm md:mb-10">
        <Image
          src={formatImageLink(thumbnail)}
          width={1280}
          height={720}
          onClick={() => {
            window.open(formatImageLink(thumbnail), "_blank");
          }}
          className="h-auto max-h-[200px] w-full cursor-pointer object-cover object-center transition-transform duration-700 hover:scale-[1.02] md:max-h-[400px]"
          alt={data.fields.title}
          itemProp="image"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
        />
        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10 dark:ring-white/10" />
      </div>

      {/* Article Content */}
      <div className="font-lora text-base leading-relaxed text-gray-800 dark:text-gray-200 md:text-lg md:leading-relaxed">
        <BlogContent data={data} />
      </div>
    </article>
  );
};

export default ArticleContent;
