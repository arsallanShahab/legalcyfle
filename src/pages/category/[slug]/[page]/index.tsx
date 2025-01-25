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
  console.log(props, "category");
  return (
    <Wrapper className="pt-2.5 md:pt-2.5">
      <AdWrapper
        // data-ad-format="fluid"
        // data-ad-layout-key="-et-7n+gx+cc-19b"
        // data-ad-slot="1973122915"
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
      <FlexContainer variant="row-end">
        {props.page > 1 ? (
          <a href={`/category/${props.slug}/${props.page - 1}`}>
            <Button variant={"secondary"}>Previous</Button>
          </a>
        ) : (
          <Button variant={"secondary"} disabled>
            Previous
          </Button>
        )}
        {props.nextPage ? (
          <a href={`/category/${props.slug}/${props.nextPage}`}>
            <Button variant={"secondary"}>Next</Button>
          </a>
        ) : (
          <Button variant={"secondary"} disabled>
            Next
          </Button>
        )}
      </FlexContainer>
    </Wrapper>
  );
};

export const getStaticPaths = async () => {
  const categories = await client.getEntries({
    content_type: "blogCategory",
  });

  const paths = await Promise.all(
    categories.items.map(async (item) => {
      const totalArticles = await client.getEntries({
        content_type: "blogPage",
        "fields.category.sys.id[in]": [item.sys.id],
        select: ["sys.id"],
        limit: 1000,
      });
      //   console.log(totalArticles, "totalArticles");
      const totalPages = Math.ceil(totalArticles.total / 5);
      return Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
        return {
          params: {
            slug: item.fields.slug,
            page: page.toString(),
            // nextPage: totalPages > page ? (page + 1).toString() : null,
          },
        };
      });
    }),
  );
  //   console.log(paths.flat(), "paths");
  return {
    paths: paths.flat(),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const slug = ctx.params?.slug;
  let page = parseInt(ctx.params?.page as string) || 1;
  console.log(slug, "slug");
  const category = await client.getEntries({
    content_type: "blogCategory",
    "fields.slug": slug,
  });
  //   console.log(category, "category");
  const articles = await client.getEntries({
    content_type: "blogPage",
    "fields.category.sys.id[in]": [category?.items[0]?.sys.id],
    select: [
      "fields.title,fields.slug,fields.image,fields.category,fields.authors,fields.description",
    ],
    // Pagination
    limit: 5,
    skip: (page - 1) * 5,
    // Sort
    order: ["-sys.createdAt"],
  });
  const nextPage = articles.total > page * 5 ? page + 1 : null;
  const safeJsonArticle = JSON.parse(safeJsonStringify(articles.items));
  // // Clean the articles data
  // const cleanedArticles = articles.items.map((article) =>
  //   removeCircularReferences(article),
  // );
  return {
    props: {
      data: safeJsonArticle,
      page: page,
      nextPage: nextPage,
      slug: slug,
    },
  };
};

export default Index;
