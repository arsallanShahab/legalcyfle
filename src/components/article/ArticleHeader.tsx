import FlexContainer from "@/components/FlexContainer";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { italiana } from "@/lib/fonts";
import { excerpt, formatImageLink, estimateReadingTime, cn } from "@/lib/utils";
import { BlogEntry } from "@/types/contentful/blog";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import { Document } from "@contentful/rich-text-types";
import { Avatar, AvatarGroup, Tooltip } from "@nextui-org/react";
import dayjs from "dayjs";
import { Share } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ArticleHeaderProps {
  data: BlogEntry;
  onShare: () => void;
  publishDate: string;
  modifiedDate: string;
  wordCount: number;
  readingTime: number;
}

const ArticleHeader: React.FC<ArticleHeaderProps> = ({
  data,
  onShare,
  publishDate,
  modifiedDate,
  wordCount,
  readingTime,
}) => {
  return (
    <>
      {/* Article Header with Semantic HTML */}
      <header className="article-header">
        <FlexContainer variant="column-start" gap="md">
          <nav aria-label="Breadcrumb">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    className="font-sans font-normal text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
                    href="/"
                  >
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    className="font-sans font-normal text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
                    href={"/category/" + data.fields.category[0]?.fields?.slug}
                  >
                    {data.fields.category[0]?.fields?.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-sans font-medium text-blue-600 dark:text-blue-400">
                    {excerpt(data.fields.title, 50)}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </nav>
          <h1
            className={cn(
              "max-w-4xl text-left text-2xl font-bold leading-tight text-gray-900 dark:text-white md:text-4xl lg:text-5xl",
              italiana.className,
            )}
            itemProp="headline"
          >
            {data.fields.title}
          </h1>
        </FlexContainer>
      </header>

      {/* Article Metadata with Schema.org microdata */}
      <section
        className="article-meta mt-4 border-b border-gray-200 pb-4 dark:border-gray-800 md:mt-6 md:pb-6"
        itemScope
        itemType="https://schema.org/Article"
      >
        <meta itemProp="headline" content={data.fields.title} />
        <meta itemProp="datePublished" content={publishDate} />
        <meta itemProp="dateModified" content={modifiedDate} />
        <meta itemProp="wordCount" content={wordCount.toString()} />
        <meta itemProp="timeRequired" content={`PT${readingTime}M`} />
        <meta itemProp="inLanguage" content="en-US" />
        <meta
          itemProp="url"
          content={`https://legalcyfle.in/${data.fields.slug}`}
        />

        <FlexContainer
          variant="row-between"
          alignItems="center"
          className="w-full"
        >
          <FlexContainer variant="row-start" alignItems="center" gap="md">
            {data.fields?.authors?.length > 1 && (
              <AvatarGroup isBordered>
                {data.fields?.authors.map((author) => (
                  <Tooltip
                    showArrow
                    placement="right"
                    classNames={{
                      base: ["before:bg-neutral-400 dark:before:bg-white"],
                      content: [
                        "py-2 px-4 shadow-xl text-nowrap break-keep text-center w-auto",
                        "text-black bg-gradient-to-br from-white to-neutral-400",
                      ],
                    }}
                    key={author.sys.id}
                    content={author.fields.name}
                  >
                    <Avatar
                      src={formatImageLink(
                        author?.fields?.avatar?.fields?.file?.url ??
                          "https://via.placeholder.com/100x100",
                      )}
                      className="h-10 w-10 rounded-full object-cover object-center"
                      alt={author.fields.name}
                    />
                  </Tooltip>
                ))}
              </AvatarGroup>
            )}

            {data.fields?.authors?.length === 1 && (
              <Image
                src={formatImageLink(
                  data?.fields?.authors[0]?.fields?.avatar?.fields?.file?.url ??
                    "https://via.placeholder.com/100x100",
                )}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover object-center"
                alt="Profile"
              />
            )}

            <FlexContainer variant="column-start" gap="xs">
              <p className="flex gap-1.5 font-sans text-sm font-bold text-gray-900 dark:text-gray-100">
                By{" "}
                {data.fields.authors.map((author, index) => (
                  <Link
                    key={author.sys.id}
                    href={`/author/${author.sys.id}`}
                    className="text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {author.fields.name}
                    {index < data.fields.authors.length - 1 && ","}
                  </Link>
                ))}
              </p>
              <p className="font-sans text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <time itemProp="datePublished" dateTime={publishDate}>
                  {data?.fields?.date
                    ? dayjs(data?.fields?.date)
                        .tz("Asia/Kolkata")
                        .format("MMM DD, YYYY")
                    : "Date not available"}
                  {" • "}
                  {estimateReadingTime(
                    documentToHtmlString(data.fields.body as Document),
                  )}{" "}
                  min read
                </time>
              </p>
            </FlexContainer>
          </FlexContainer>

          {/* Minimal share button */}
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-full border-gray-200 bg-transparent hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            onClick={onShare}
          >
            <Share className="h-4 w-4" />
            <span className="hidden text-sm sm:inline">Share</span>
          </Button>
        </FlexContainer>
      </section>
    </>
  );
};

export default ArticleHeader;
