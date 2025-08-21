import AdWrapper from "@/components/AdWrapper";
import ArticleCard from "@/components/ArticleCard";
import FlexContainer from "@/components/FlexContainer";
import { Button } from "@/components/ui/button";
import Wrapper from "@/components/Wrapper";
import client from "@/lib/contentful";
import { removeCircularReferences } from "@/lib/utils";
import { BlogEntries } from "@/types/contentful/blog";
import { GetStaticProps } from "next";
import Link from "next/link";
import React from "react";
import safeJsonStringify from "safe-json-stringify";

type Props = {
  data: BlogEntries;
  slug: string;
  page: number;
  nextPage: number | null;
};

const Index = (props: Props) => {
  return (
    <Wrapper className="pt-2.5 md:pt-2.5">
      <AdWrapper
        data-ad-slot="4210005765"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <h1 className="font-giest-sans text-4xl">
        {props.data[0]?.fields?.category[0]?.fields.name}
      </h1>
      {props?.data?.map((article) => {
        return <ArticleCard article={article} key={article.sys.id} />;
      })}
      <FlexContainer variant="row-end" alignItems="center">
        {props.page > 1 ? (
          <a href={`/category/${props.slug}/${props.page - 1}`}>
            <Button variant={"secondary"}>Previous Page</Button>
          </a>
        ) : (
          <Button variant={"secondary"} disabled>
            Previous Page
          </Button>
        )}
        {props.nextPage ? (
          <span className="font-giest-mono text-sm font-semibold">
            Page {props.page}
          </span>
        ) : null}
        {props.nextPage ? (
          <a href={`/category/${props.slug}/${props.nextPage}`}>
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
  );
};

export const getStaticPaths = async () => {
  try {
    const categories = await client.getEntries({
      content_type: "blogCategory",
      select: ["fields.slug", "sys.id"],
      limit: 5, // Only pre-build paths for top 5 categories
    });

    const paths = await Promise.all(
      categories.items.map(async (item) => {
        try {
          // Just get total count, not actual entries
          const totalArticles = await client.getEntries({
            content_type: "blogPage",
            "fields.category.sys.id[in]": [item.sys.id],
            select: ["sys.id"],
            limit: 1, // We only need the total count
          });

          const totalPages = Math.ceil(totalArticles.total / 5);
          // Only generate paths for first 5 pages max to avoid excessive builds
          const pagesToGenerate = Math.min(totalPages, 5);

          return Array.from({ length: pagesToGenerate }, (_, i) => ({
            params: {
              slug: item.fields.slug,
              page: (i + 1).toString(),
            },
          }));
        } catch (error) {
          console.error(
            `Error generating paths for category ${item.fields.slug}:`,
            error,
          );
          return [];
        }
      }),
    );

    return {
      paths: paths.flat().filter(Boolean),
      fallback: "blocking", // Generate other pages on-demand
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
    const slug = ctx.params?.slug;
    let page = parseInt(ctx.params?.page as string) || 1;

    if (!slug) {
      return { notFound: true };
    }

    // Get only category ID to use in article query
    const category = await client
      .getEntries({
        content_type: "blogCategory",
        "fields.slug": slug,
        select: ["sys.id", "fields.name", "fields.slug"],
      })
      .catch((error) => {
        console.error("Error fetching category:", error);
        return { items: [] };
      });

    if (!category?.items?.length) {
      return { notFound: true };
    }

    // Get only necessary fields from articles
    const articles = await client
      .getEntries({
        content_type: "blogPage",
        "fields.category.sys.id[in]": [category?.items[0]?.sys.id],
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
        skip: (page - 1) * 5,
        order: ["-sys.createdAt"],
      })
      .catch((error) => {
        console.error("Error fetching articles:", error);
        return { items: [], total: 0 };
      });

    const nextPage = articles.total > page * 5 ? page + 1 : null;

    let safeJsonArticle = [];
    try {
      safeJsonArticle = JSON.parse(safeJsonStringify(articles.items));
    } catch (error) {
      console.error("Error stringifying articles:", error);
      safeJsonArticle = articles.items;
    }

    return {
      props: {
        data: safeJsonArticle,
        page: page,
        nextPage: nextPage,
        slug: slug,
      },
      // ISR: Revalidate every 30 minutes
      revalidate: 1800,
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return { notFound: true };
  }
};

export default Index;
