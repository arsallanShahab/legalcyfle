import { cn, estimateReadingTime, formatImageLink } from "@/lib/utils";
import { BlogEntry } from "@/types/contentful/blog";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import { Document } from "@contentful/rich-text-types";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import FlexContainer from "./FlexContainer";
import { Badge } from "./ui/badge";
// tz
import tz from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { italiana, playfair } from "@/lib/fonts";
dayjs.extend(utc);
dayjs.extend(tz);

type Props = {
  article: BlogEntry;
};

const ArticleCard = ({ article }: Props) => {
  const thumbnail =
    article?.fields?.image?.fields?.file?.url ||
    "https://picsum.photos/500/500";
  return (
    <div
      key={article.sys.id}
      className="relative flex flex-col items-start justify-start gap-4 pt-4 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 md:flex-row md:*:w-auto"
    >
      <div className="relative w-full md:w-auto">
        <Image
          src={formatImageLink(thumbnail)}
          alt={article.fields.title}
          width={500}
          height={500}
          className="h-[200px] w-full object-cover grayscale transition-all duration-500 hover:grayscale-0 md:h-[160px] md:w-[260px]"
        />
        <a
          href={`/${article.fields.slug}`}
          className="absolute inset-0 h-full w-full"
        >
          <p className="sr-only">Read More</p>
        </a>
      </div>

      <FlexContainer
        variant="column-start"
        wrap="wrap"
        className="h-full flex-1 px-0 pb-2 md:px-4 md:py-0"
        gap="sm"
      >
        <FlexContainer variant="row-start" className="gap-2">
          {article.fields.category?.map((category) => (
            <a href={`/category/${category.fields.slug}`} key={category.sys.id}>
              <span
                key={category.sys.id}
                className="border border-gray-300 bg-transparent px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-widest text-gray-600 transition-colors hover:border-gray-900 hover:text-gray-900 dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-300 dark:hover:text-gray-200"
              >
                {category.fields.name}
              </span>
            </a>
          ))}
        </FlexContainer>
        <a
          href={"/" + article.fields.slug}
          className={cn(
            "max-w-none text-xl font-bold leading-tight text-gray-900 transition-colors duration-200 hover:text-blue-800 dark:text-white md:text-2xl",
            playfair.className,
          )}
        >
          {article.fields.title}
        </a>
        <p className="max-w-none font-lora text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {article.fields.description?.length > 140 ? (
            <span>{article.fields.description.substring(0, 140)}...</span>
          ) : (
            article.fields.description
          )}
        </p>
        <FlexContainer
          variant="row-start"
          alignItems="center"
          wrap="wrap"
          className="mt-auto gap-3 pt-2 md:max-w-none"
        >
          <FlexContainer alignItems="center" className="relative" wrap="wrap">
            <FlexContainer gap="sm" alignItems="center" wrap="wrap">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gray-500">
                By
              </span>
              {article.fields?.authors?.map((author) => (
                <a
                  href={"/author/" + author.sys.id}
                  key={author.sys.id}
                  className="text-nowrap font-sans text-xs font-bold uppercase tracking-wider text-gray-900 underline decoration-gray-300 underline-offset-4 transition-all hover:decoration-gray-900 dark:text-gray-200 dark:decoration-gray-600 dark:hover:decoration-gray-300"
                >
                  {author.fields.name}
                </a>
              ))}
            </FlexContainer>
            <span className="mx-2 text-xs font-bold text-gray-300 dark:text-gray-700">
              |
            </span>
            <p className="text-nowrap font-sans text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {article?.fields?.date
                ? dayjs(article?.fields?.date)
                    .tz("Asia/Kolkata")
                    .format("MMM DD")
                : "Date not available"}
            </p>
            <span className="text-xs font-bold text-gray-400 dark:text-gray-600">
              •
            </span>
            <div className="text-nowrap text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {estimateReadingTime(
                documentToHtmlString(article.fields.body as Document),
              )}{" "}
              min read
            </div>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </div>
  );
};

export default ArticleCard;
