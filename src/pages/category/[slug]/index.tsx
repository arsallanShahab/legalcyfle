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
  nextPage: number | null;
  slug: string;
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
      {props.nextPage && (
        <FlexContainer variant="row-end">
          <a href={`/category/${props.slug}/${props.nextPage}`}>
            <Button
              variant={"secondary"}
              className="font-giest-mono text-sm font-semibold"
            >
              Next Page ({props.nextPage})
            </Button>
          </a>
        </FlexContainer>
      )}
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
    // Only pre-build the most popular categories
    const categories = await client.getEntries({
      content_type: "blogCategory",
      select: ["fields.slug"],
      limit: 5, // Only pre-build top 5 categories
    });

    const paths = categories.items.map((item) => ({
      params: { slug: item.fields.slug },
    }));

    return {
      paths,
      fallback: "blocking", // Generate other categories on-demand
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

    if (!slug) {
      return { notFound: true };
    }

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
          "fields.authors",
          "sys.id",
          "sys.createdAt",
        ],
        limit: 5,
        order: ["-sys.createdAt"],
      })
      .catch((error) => {
        console.error("Error fetching articles:", error);
        return { items: [], total: 0 };
      });

    const nextPage = articles.total > 5 ? 2 : null;

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
        nextPage,
        slug,
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
