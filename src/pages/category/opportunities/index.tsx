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
      <Heading>Opportunities</Heading>
      {props?.data?.map((article) => {
        return <ArticleCard article={article} key={article.sys.id} />;
      })}
      {props.nextPage && (
        <FlexContainer variant="row-end">
          <a href={`/category/opportunities/${props.nextPage}`}>
            <Button
              variant={"secondary"}
              className="font-giest-mono text-sm font-semibold"
            >
              Next Page ({props.nextPage})
            </Button>
          </a>
        </FlexContainer>
      )}
    </Wrapper>
  );
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const articles = await client.getEntries({
    content_type: "blogPage",
    "fields.category.sys.id[in]": [
      "2uezIzO3zSYohdj6yen0xm",
      "2pZtFZgrtxrmJJaH1cBoIm",
      "6sRbgihUKlv69O5GPGQWyf",
      "7pelb3XNHLU4tLsuifmAkf",
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
