import AdWrapper from "@/components/AdWrapper";
import ArticleCard from "@/components/ArticleCard";
import FlexContainer from "@/components/FlexContainer";
import { Button } from "@/components/ui/button";
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
    nextPage: number | null;
  };
};

const Index = (props: Props) => {
  return (
    <Wrapper>
      <AdWrapper
        data-ad-slot="4210005765"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
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
            className="h-20 w-20 rounded-full border"
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
      <FlexContainer variant="row-end" alignItems="center">
        {props.data.nextPage ? (
          <a
            href={`/author/${props.data.author.sys.id}/${props.data.nextPage}`}
          >
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
  const authors = await client.getEntries({
    content_type: "author",
    select: ["sys.id"],
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
  const authorArticles = (await client.getEntries({
    content_type: "blogPage",
    "fields.authors.sys.id[in]": [id],
    include: 1,
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
  })) as any;

  let safeJsonArticle = [];

  try {
    safeJsonArticle = JSON.parse(safeJsonStringify(authorArticles.items));
  } catch (error) {
    const minimalArticles = authorArticles.items.map(
      (article: {
        sys: { id: any; createdAt: any };
        fields: {
          title: any;
          slug: any;
          description: any;
          date: any;
          image: {
            sys: { id: any };
            fields: { title: any; file: { url: any; details: { image: any } } };
          };
          category: { sys: { id: any }; fields: { name: any; slug: any } }[];
        };
      }) => ({
        sys: {
          id: article.sys.id,
          createdAt: article.sys.createdAt,
        },
        fields: {
          title: article.fields.title,
          slug: article.fields.slug,
          description: article.fields.description,
          date: article.fields.date,
          // Only essential image data
          image: article.fields.image
            ? {
                sys: { id: article.fields.image.sys.id },
                fields: {
                  title: article.fields.image.fields.title,
                  file: {
                    url: article.fields.image.fields.file.url,
                    details: {
                      image: article.fields.image.fields.file.details?.image,
                    },
                  },
                },
              }
            : null,
          // Only essential category data
          category: Array.isArray(article.fields.category)
            ? article.fields.category.map(
                (cat: {
                  sys: { id: any };
                  fields: { name: any; slug: any };
                }) => ({
                  sys: { id: cat.sys.id },
                  fields: {
                    name: cat.fields.name,
                    slug: cat.fields.slug,
                  },
                }),
              )
            : [],
        },
      }),
    );
    safeJsonArticle = minimalArticles;
  }

  const nextPage = authorArticles.total > 5 ? 2 : null;

  return {
    props: {
      data: {
        author,
        articles: safeJsonArticle,
        nextPage,
      },
    },
  };
};

export default Index;
