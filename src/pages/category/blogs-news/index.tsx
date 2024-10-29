import ArticleCard from "@/components/ArticleCard";
import Heading from "@/components/Heading";
import Wrapper from "@/components/Wrapper";
import client from "@/lib/contentful";
import { BlogEntries } from "@/types/contentful/blog";
import { GetStaticProps } from "next";
import React from "react";
import safeJsonStringify from "safe-json-stringify";

type Props = {
  data: BlogEntries;
};

const Index = (props: Props) => {
  return (
    <Wrapper>
      <Heading>Blogs & News</Heading>
      {props?.data?.map((article) => {
        return <ArticleCard article={article} key={article.sys.id} />;
      })}
    </Wrapper>
  );
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const category = await client.getEntries({
    content_type: "blogCategory",
  });
  console.log(category, "category");
  const articles = await client.getEntries({
    content_type: "blogPage",
    "fields.category.sys.id[in]": [
      "1QwcWNFQPAYrbQ5DtUasxD",
      "2gwE6uMGZBUL17DtfmRjC4",
    ],
    select: [
      "fields.title,fields.slug,fields.image,fields.category,fields.authors,fields.description",
    ],
  });

  const safeJsonArticle = JSON.parse(safeJsonStringify(articles.items));
  return {
    props: {
      data: safeJsonArticle,
    },
  };
};

export default Index;
