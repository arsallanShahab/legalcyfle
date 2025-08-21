import { estimateReadingTime, formatImageLink } from "@/lib/utils";
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
      className="relative flex flex-col items-start justify-start gap-4 border-b border-gray-200 bg-white transition-colors duration-200 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 md:flex-row md:py-6 md:*:w-auto"
    >
      <div className="relative w-full">
        <Image
          src={formatImageLink(thumbnail)}
          alt={article.fields.title}
          width={500}
          height={500}
          className="h-[180px] w-full object-cover md:h-[140px] md:w-[240px]"
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
        className="h-full flex-1 px-4 pb-4 pt-2 md:px-6 md:py-0"
        gap="sm"
      >
        <FlexContainer variant="row-start" className="gap-1">
          {article.fields.category?.map((category) => (
            <a href={`/category/${category.fields.slug}`} key={category.sys.id}>
              <span
                key={category.sys.id}
                className="border-0 bg-transparent px-1 py-0 text-xs font-bold uppercase tracking-wider text-blue-600 transition-colors hover:bg-transparent hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {category.fields.name}
              </span>
            </a>
          ))}
        </FlexContainer>
        <a
          href={"/" + article.fields.slug}
          className="max-w-none text-xl font-bold leading-tight text-gray-900 transition-colors duration-200 hover:text-blue-600 dark:text-white md:text-2xl"
        >
          {article.fields.title}
        </a>
        <p className="max-w-none text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {article.fields.description?.length > 120 ? (
            <span>{article.fields.description.substring(0, 120)}...</span>
          ) : (
            article.fields.description
          )}
        </p>
        <FlexContainer
          variant="row-start"
          alignItems="center"
          wrap="wrap"
          className="mt-2 gap-3 md:max-w-none"
        >
          <FlexContainer alignItems="center" className="relative" wrap="wrap">
            <FlexContainer gap="sm" alignItems="center" wrap="wrap">
              {article.fields?.authors?.map((author) => (
                <a
                  href={"/author/" + author.sys.id}
                  key={author.sys.id}
                  className="text-nowrap text-xs font-bold uppercase tracking-wider text-green-600 transition-colors duration-200 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                >
                  {author.fields.name}
                </a>
              ))}
            </FlexContainer>
            <span className="text-xs font-bold text-gray-400 dark:text-gray-600">
              •
            </span>
            <p className="text-nowrap text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
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
