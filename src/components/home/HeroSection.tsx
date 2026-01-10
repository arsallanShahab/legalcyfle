import FlexContainer from "@/components/FlexContainer";
import { Badge } from "@/components/ui/badge";
import { BentoGrid } from "@/components/ui/BentoGrid";
import { formatImageLink, estimateReadingTime, cn } from "@/lib/utils";
import { Author } from "@/types/contentful/author";
import { BlogEntry } from "@/types/contentful/blog";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import { Document } from "@contentful/rich-text-types";
import dayjs from "dayjs";
import tz from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Image from "next/image";
import Link from "next/link";

// Initialize dayjs plugins
dayjs.extend(utc);
dayjs.extend(tz);

interface HeroSectionProps {
  topArticles: BlogEntry[];
  employeeOfTheMonth: {
    fields: {
      title: string;
      authors: Author[];
      month: string;
    };
    sys: { id: string; type: "Entry" };
  } | null;
}

export default function HeroSection({
  topArticles,
  employeeOfTheMonth,
}: HeroSectionProps) {
  const articles = topArticles?.slice(0, 10) || [];
  const count = articles.length;

  const getTitleSize = (index: number, count: number) => {
    if (index === 0) return "text-2xl md:text-4xl lg:text-5xl";
    if (count === 4 && index === 1) return "text-xl md:text-2xl";
    if (
      count >= 7 &&
      (index === 1 || index === 6 || index === 8 || index === 9)
    )
      return "text-xl md:text-2xl";
    return "text-lg md:text-xl";
  };

  return (
    <div className="flex flex-col gap-8 px-3 md:px-5 lg:px-10">
      {/* Bento Grid for Articles */}
      <BentoGrid
        items={articles}
        renderItem={(article, index, spanClasses) => {
          const titleSize = getTitleSize(index, count);
          return (
            <Link
              key={article.sys.id}
              href={article.fields?.slug || "#"}
              className={`group relative block h-[250px] w-full overflow-hidden border border-gray-200 dark:border-gray-800 md:h-full ${spanClasses}`}
            >
              <div className="relative h-full w-full">
                <Image
                  src={formatImageLink(
                    article.fields?.image?.fields?.file?.url ||
                      "https://picsum.photos/800/600",
                  )}
                  alt={article.fields?.title}
                  width={1280}
                  height={720}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 md:p-6">
                  <div className="mb-2 flex flex-wrap gap-2">
                    {article.fields.category?.slice(0, 1).map((category) => (
                      <span
                        key={category.sys.id}
                        className="bg-blue-600 px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wider text-white"
                      >
                        {category.fields.name}
                      </span>
                    ))}
                  </div>
                  <h2
                    className={cn(
                      `font-google font-bold leading-tight text-white`,
                      titleSize,
                      index > 0 ? "line-clamp-2" : "",
                    )}
                  >
                    {article.fields?.title}
                  </h2>
                  <div className="mt-2 flex items-center gap-2 text-white/80">
                    <p className="font-sans text-[10px] font-bold uppercase tracking-wider">
                      {dayjs(article.fields?.date).format("MMM DD")}
                    </p>
                    {index === 0 && (
                      <>
                        <span className="text-[10px]">•</span>
                        <p className="font-sans text-[10px] font-bold uppercase tracking-wider">
                          By {article.fields?.authors?.[0]?.fields?.name}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        }}
      />

      {/* Employee of the Month Section (Bottom Row) */}
      {employeeOfTheMonth &&
        employeeOfTheMonth?.fields?.authors?.length > 0 && (
          <div className="w-full border-y-2 border-black py-6 dark:border-white">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-playfair text-2xl font-bold uppercase tracking-tight text-gray-900 dark:text-white">
                Co-ordinator of the Month
              </h3>
              <span className="font-sans text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {employeeOfTheMonth?.fields?.month}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {employeeOfTheMonth?.fields?.authors.map((author) => (
                <Link
                  href={`/author/${author.sys.id}`}
                  key={author.sys.id}
                  className="group flex items-center gap-4"
                >
                  <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-gray-200 transition-colors group-hover:border-black dark:border-gray-700 dark:group-hover:border-white">
                    <Image
                      src={formatImageLink(
                        author.fields?.avatar?.fields?.file?.url ||
                          "https://picsum.photos/200/200",
                      )}
                      alt={author.fields.name}
                      width={100}
                      height={100}
                      className="h-full w-full object-cover grayscale transition-all duration-300 group-hover:grayscale-0"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="font-playfair text-lg font-bold leading-tight text-gray-900 dark:text-white">
                      {author.fields.name}
                    </p>
                    <p className="line-clamp-2 font-lora text-xs text-gray-600 dark:text-gray-400">
                      {author.fields.bio}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}
