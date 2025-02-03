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
      <h1 className="font-giest-sans text-4xl">Resources</h1>
      {props?.data?.map((article) => {
        return <ArticleCard article={article} key={article.sys.id} />;
      })}
      <FlexContainer variant="row-end" alignItems="center">
        {props.page > 1 ? (
          <a href={`/category/opportunities/${props.page - 1}`}>
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
          <a href={`/category/opportunities/${props.nextPage}`}>
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
  const totalArticles = await client.getEntries({
    content_type: "blogPage",
    "fields.category.sys.id[in]": [
      "eRjmnFe7Veqqkz1bDlH2F",
      "7aq38iMXGWwYnP61tHxRfb",
    ],
    select: ["sys.id"],
    limit: 1000,
  });
  const totalPages = Math.ceil(totalArticles.total / 5);
  const paths = Array.from({ length: totalPages }, (_, i) => ({
    params: { page: (i + 1).toString() },
  }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  let page = parseInt(ctx.params?.page as string) || 1;
  const articles = await client.getEntries({
    content_type: "blogPage",
    "fields.category.sys.id[in]": [
      "eRjmnFe7Veqqkz1bDlH2F",
      "7aq38iMXGWwYnP61tHxRfb",
    ],
    // Pagination
    limit: 5,
    skip: (page - 1) * 5,
    order: ["-sys.createdAt"],
  });
  const nextPage = articles.total > page * 5 ? page + 1 : null;
  const safeJsonArticle = JSON.parse(safeJsonStringify(articles.items));
  return {
    props: {
      data: safeJsonArticle,
      page: page,
      nextPage: nextPage,
    },
  };
};

export default Index;
