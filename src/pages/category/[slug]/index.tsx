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
  const categories = await client.getEntries({
    content_type: "blogCategory",
  });
  const paths = categories.items.map((item) => ({
    params: { slug: item.fields.slug },
  }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const slug = ctx.params?.slug;
  const category = await client.getEntries({
    content_type: "blogCategory",
    "fields.slug": slug,
  });
  const articles = await client.getEntries({
    content_type: "blogPage",
    "fields.category.sys.id[in]": [category?.items[0]?.sys.id],
    limit: 5,
    order: ["-sys.createdAt"],
  });
  const nextPage = articles.total > 5 ? 2 : null;

  const safeJsonArticle = JSON.parse(safeJsonStringify(articles.items));
  return {
    props: {
      data: safeJsonArticle,
      nextPage,
      slug,
    },
  };
};

export default Index;
