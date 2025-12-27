import AdWrapper from "@/components/AdWrapper";
import ArticleCard from "@/components/ArticleCard";
import FlexContainer from "@/components/FlexContainer";
import { Button } from "@/components/ui/button";
import Wrapper from "@/components/Wrapper";
import client from "@/lib/contentful";
import { playfair } from "@/lib/fonts";
import { cn, formatImageLink } from "@/lib/utils";
import { Author } from "@/types/contentful/author";
import { BlogEntries } from "@/types/contentful/blog";
import { GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import React from "react";
import safeJsonStringify from "safe-json-stringify";

type Props = {
  data: {
    author: Author;
    articles: BlogEntries;
    nextPage: number | null;
  };
};

const Index = (props: Props) => {
  return (
    <>
      <Head>
        <title>
          {props.data.author.fields.name} - Author Profile | LegalCyfle
        </title>
        <meta
          name="description"
          content={`Read articles by ${props.data.author.fields.name} on LegalCyfle. ${props.data.author.fields?.bio || ""}`}
        />

        {/* Prevent indexing of author pages */}
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
        <meta
          name="googlebot"
          content="noindex, nofollow, noarchive, nosnippet"
        />
        <meta
          name="bingbot"
          content="noindex, nofollow, noarchive, nosnippet"
        />

        {/* Canonical URL */}
        <link
          rel="canonical"
          href={`https://legalcyfle.in/author/${props.data.author.sys.id}`}
        />

        {/* Additional directives */}
        <meta name="author" content="LegalCyfle" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Wrapper>
        <AdWrapper
          data-ad-slot="4210005765"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
        <FlexContainer variant="column-start" gap="md">
          <div>
            <Image
              src={formatImageLink(
                props.data.author.fields?.avatar?.fields.file.url ||
                  "https://picsum.photos/200/200",
              )}
              alt={props.data.author.fields.name}
              width={200}
              height={200}
              className="h-20 w-20 rounded-full border"
            />
          </div>
          <h3 className={cn("text-4xl font-semibold", playfair.className)}>
            {props.data.author.fields.name}
          </h3>
          <p className="max-w-xl text-base text-gray-600 dark:text-gray-100">
            {props.data.author.fields?.bio}
          </p>
        </FlexContainer>
        {props.data.articles.map((article) => (
          <ArticleCard article={article} key={article?.sys?.id} />
        ))}
        <FlexContainer variant="row-end" alignItems="center">
          {props.data.nextPage ? (
            <a
              href={`/author/${props.data.author.sys.id}/${props.data.nextPage}`}
            >
              <Button variant={"secondary"}>Next Page</Button>
            </a>
          ) : (
            <Button variant={"secondary"} disabled>
              Next Page
            </Button>
          )}
        </FlexContainer>

        <AdWrapper
          data-ad-slot="4210005765"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </Wrapper>
    </>
  );
};

export const getStaticPaths = async () => {
  try {
    // Only pre-build the most popular/important authors
    const authors = await client.getEntries({
      content_type: "author",
      select: ["sys.id"],
      limit: 10, // Only pre-build top 10 authors
      order: ["-sys.createdAt"], // Most recent first, or use view count if available
    });

    const paths = authors.items.map((item) => ({
      params: { id: item.sys.id },
    }));

    return {
      paths,
      fallback: "blocking", // Generate pages on-demand for other authors
    };
  } catch (error) {
    console.error("Error in getStaticPaths:", error);
    return {
      paths: [],
      fallback: "blocking",
    };
  }
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  try {
    const id = ctx.params?.id as string;

    if (!id) {
      return { notFound: true };
    }

    // Get only necessary author fields
    const author = await client.getEntry(id).catch((error) => {
      console.error("Error fetching author:", error);
      return null;
    });

    if (!author) {
      return { notFound: true };
    }

    const authorArticles = (await client
      .getEntries({
        content_type: "blogPage",
        "fields.authors.sys.id[in]": [id],
        include: 1,
        select: [
          "fields.title",
          "fields.slug",
          "fields.description",
          "fields.date",
          "fields.image",
          "fields.category",
          "sys.id",
          "sys.createdAt",
        ],
        limit: 5,
      })
      .catch((error) => {
        console.error("Error fetching author articles:", error);
        return { items: [], total: 0 };
      })) as any;

    let safeJsonArticle = [];
    let safeJsonAuthor = {};

    try {
      safeJsonArticle = JSON.parse(safeJsonStringify(authorArticles.items));
      safeJsonAuthor = JSON.parse(safeJsonStringify(author));
    } catch (error) {
      console.error("Error stringifying data:", error);

      const minimalArticles = authorArticles.items.map(
        (article: {
          sys: { id: any; createdAt: any };
          fields: {
            title: any;
            slug: any;
            description: any;
            date: any;
            image: {
              sys: { id: any };
              fields: {
                title: any;
                file: { url: any; details: { image: any } };
              };
            };
            category: { sys: { id: any }; fields: { name: any; slug: any } }[];
          };
        }) => ({
          sys: {
            id: article.sys.id,
            createdAt: article.sys.createdAt,
          },
          fields: {
            title: article.fields.title,
            slug: article.fields.slug,
            description: article.fields.description,
            date: article.fields.date,
            // Only essential image data
            image: article.fields.image
              ? {
                  sys: { id: article.fields.image.sys.id },
                  fields: {
                    title: article.fields.image.fields.title,
                    file: {
                      url: article.fields.image.fields.file.url,
                      details: {
                        image: article.fields.image.fields.file.details?.image,
                      },
                    },
                  },
                }
              : null,
            // Only essential category data
            category: Array.isArray(article.fields.category)
              ? article.fields.category.map(
                  (cat: {
                    sys: { id: any };
                    fields: { name: any; slug: any };
                  }) => ({
                    sys: { id: cat.sys.id },
                    fields: {
                      name: cat.fields.name,
                      slug: cat.fields.slug,
                    },
                  }),
                )
              : [],
          },
        }),
      );
      safeJsonArticle = minimalArticles;
      safeJsonAuthor = author;
    }

    const nextPage = authorArticles.total > 5 ? 2 : null;

    return {
      props: {
        data: {
          author: safeJsonAuthor,
          articles: safeJsonArticle,
          nextPage,
        },
      },
      // ISR: Revalidate every hour
      revalidate: 3600,
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return { notFound: true };
  }
};

export default Index;
