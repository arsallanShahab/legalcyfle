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
      className="relative flex flex-col items-start justify-start gap-2 rounded-xl bg-zinc-100 *:w-full dark:border-zinc-900 dark:bg-zinc-800 md:flex-row md:p-2 md:*:w-auto"
    >
      <div className="relative w-full">
        <Image
          src={formatImageLink(thumbnail)}
          alt={article.fields.title}
          width={500}
          height={500}
          className="h-[200px] w-full rounded-xl border object-cover dark:border-zinc-800 md:w-[275px]"
        />
        <Link
          href={`/${article.fields.slug}`}
          className="absolute inset-0 h-full w-full"
        >
          <p className="sr-only">Read More</p>
        </Link>
      </div>

      <FlexContainer
        variant="column-start"
        wrap="wrap"
        className="h-full px-3 pb-3 pt-2 md:px-5"
        gap="sm"
      >
        <FlexContainer variant="row-start">
          {article.fields.category?.map((category) => (
            <a href={`/category/${category.fields.slug}`} key={category.sys.id}>
              <Badge
                key={category.sys.id}
                variant={"default"}
                className="rounded-3xl text-sm"
              >
                {category.fields.name}
              </Badge>
            </a>
          ))}
        </FlexContainer>
        <Link
          href={"/" + article.fields.slug}
          className="max-w-xl text-xl font-medium text-black hover:text-green-600 hover:underline dark:text-zinc-100"
        >
          {article.fields.title}
        </Link>
        <p className="max-w-xl text-gray-700 dark:text-gray-400">
          {article.fields.description?.length > 150 ? (
            <span>{article.fields.description.substring(0, 150)}...</span>
          ) : (
            article.fields.description
          )}
          {/* {article.fields.body.content[0]?.value} */}
        </p>
        <FlexContainer
          variant="row-start"
          alignItems="center"
          wrap="wrap"
          className="gap-1 md:max-w-xl md:gap-3"
        >
          <FlexContainer alignItems="center" className="relative" wrap="wrap">
            <FlexContainer gap="xs" alignItems="center" wrap="wrap">
              <span className="text-xs">By</span>
              {article.fields?.authors?.map((author) => (
                <Link
                  href={"/author/" + author.sys.id}
                  key={author.sys.id}
                  className="text-nowrap rounded-xl bg-zinc-200 px-2 py-1 text-xs text-black hover:underline dark:bg-zinc-900 dark:text-gray-400"
                >
                  {author.fields.name}{" "}
                  {/* {index < article.fields.authors.length - 1 && ","} */}
                </Link>
              ))}
            </FlexContainer>
            {/* <Link
              href={"/author/" + article.fields.author.sys.id}
              className="text-nowrap p-1 text-xs text-black hover:underline dark:text-gray-400"
            >
              By {article.fields.author.fields.name}
            </Link> */}
            {/* <Divider
              orientation="vertical"
              className="h-4 w-[1px] bg-gray-500"
            /> */}
            <span className="hidden md:block">•</span>
            <p className="text-nowrap rounded-xl bg-zinc-200 px-2 py-1 text-xs text-black dark:bg-zinc-900 dark:text-gray-400">
              {/* july 7 2024 with time */}
              {article?.fields?.date
                ? dayjs(article?.fields?.date)
                    .tz("Asia/Kolkata")
                    .format("MMMM DD, YYYY")
                : "Date not available"}
            </p>
            <span className="hidden md:block">•</span>
            <div className="text-nowrap rounded-xl bg-zinc-200 px-2 py-1 text-xs text-black dark:bg-zinc-900 dark:text-gray-400">
              {estimateReadingTime(
                documentToHtmlString(article.fields.body as Document),
              )}{" "}
              min read
              {/* {article.fields?.readTime} min read */}
            </div>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </div>
  );
};

export default ArticleCard;
