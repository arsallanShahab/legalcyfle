import AdWrapper from "@/components/AdWrapper";
import ArticleCard from "@/components/ArticleCard";
import Wrapper from "@/components/Wrapper";
import client from "@/lib/contentful";
import { removeCircularReferences } from "@/lib/utils";
import { BlogEntries } from "@/types/contentful/blog";
import { GetStaticProps } from "next";
import React from "react";
import safeJsonStringify from "safe-json-stringify";

type Props = {
  data: BlogEntries;
};

const Index = (props: Props) => {
  console.log(props.data, "category");
  return (
    <Wrapper>
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
  console.log(paths);
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const slug = ctx.params?.slug;
  console.log(slug, "slug");
  const category = await client.getEntries({
    content_type: "blogCategory",
    "fields.slug": slug,
  });
  console.log(category, "category");
  const articles = await client.getEntries({
    content_type: "blogPage",
    "fields.category.sys.id[in]": [category?.items[0]?.sys.id],
    select: [
      "fields.title,fields.slug,fields.image,fields.category,fields.authors,fields.description",
    ],
  });

  const safeJsonArticle = JSON.parse(safeJsonStringify(articles.items));
  // // Clean the articles data
  // const cleanedArticles = articles.items.map((article) =>
  //   removeCircularReferences(article),
  // );
  return {
    props: {
      data: safeJsonArticle,
    },
  };
};

export default Index;
