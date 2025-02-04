import ArticleCard from "@/components/ArticleCard";
import FlexContainer from "@/components/FlexContainer";
import Wrapper from "@/components/Wrapper";
import client from "@/lib/contentful";
import { formatImageLink } from "@/lib/utils";
import { Author } from "@/types/contentful/author";
import { BlogEntries } from "@/types/contentful/blog";
import { GetStaticProps } from "next";
import Image from "next/image";
import React from "react";
import safeJsonStringify from "safe-json-stringify";

type Props = {
  data: {
    author: Author;
    articles: BlogEntries;
  };
};

const Index = (props: Props) => {
  return (
    <Wrapper>
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
            className="h-20 w-20 rounded-full"
          />
        </div>
        <h3 className="text-4xl font-semibold text-green-500">
          {props.data.author.fields.name}
        </h3>
        <p className="max-w-xl text-base text-gray-600">
          {props.data.author.fields?.bio}
        </p>
      </FlexContainer>
      {props.data.articles.map((article) => (
        <ArticleCard article={article} key={article?.sys?.id} />
      ))}
    </Wrapper>
  );
};

export const getStaticPaths = async () => {
  const authors = await client.getEntries({
    content_type: "author",
  });
  const paths = authors.items.map((item) => ({
    params: { id: item.sys.id },
  }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const id = ctx.params?.id as string;
  const author = await client.getEntry(id);
  const authorArticles = await client.getEntries({
    content_type: "blogPage",
    "fields.authors.sys.id[in]": [id],
  });

  const safeJsonArticle = JSON.parse(safeJsonStringify(authorArticles.items));

  return {
    props: {
      data: {
        author,
        articles: authorArticles.items,
      },
    },
  };
};

export default Index;
