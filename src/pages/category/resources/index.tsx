import AdWrapper from "@/components/AdWrapper";
import ArticleCard from "@/components/ArticleCard";
import FlexContainer from "@/components/FlexContainer";
import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import Wrapper from "@/components/Wrapper";
import client from "@/lib/contentful";
import { BlogEntries } from "@/types/contentful/blog";
import { GetStaticProps } from "next";
import React from "react";
import safeJsonStringify from "safe-json-stringify";

type Props = {
  data: BlogEntries;
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
      <Heading>Resources</Heading>
      {props?.data?.map((article) => {
        return <ArticleCard article={article} key={article.sys.id} />;
      })}
      {props.nextPage && (
        <FlexContainer variant="row-end">
          <a href={`/category/resources/${props.nextPage}`}>
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

export const getStaticProps: GetStaticProps = async (ctx) => {
  const category = await client.getEntries({
    content_type: "blogCategory",
  });
  console.log(category, "category");
  const articles = await client.getEntries({
    content_type: "blogPage",
    "fields.category.sys.id[in]": [
      "eRjmnFe7Veqqkz1bDlH2F",
      "7aq38iMXGWwYnP61tHxRfb",
    ],
    limit: 5,
    order: ["-sys.createdAt"],
  });

  const nextPage = articles.total > 5 ? 2 : null;

  const safeJsonArticle = JSON.parse(safeJsonStringify(articles.items));
  return {
    props: {
      data: safeJsonArticle,
      nextPage,
    },
  };
};

export default Index;
