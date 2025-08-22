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
import Head from "next/head";
import Image from "next/image";
import safeJsonStringify from "safe-json-stringify";

type Props = {
  author: Author;
  articles: BlogEntries;
  page: number;
  nextPage: number | null;
};

const Index = ({ author, articles, nextPage, page }: Props) => {
  return (
    <>
      <Head>
        <title>{author.fields.name} - Page {page} | Author Profile | LegalCyfle</title>
        <meta name="description" content={`Articles by ${author.fields.name} - Page ${page} on LegalCyfle. ${author.fields?.bio || ''}`} />
        
        {/* Prevent indexing of paginated author pages */}
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
        <meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet" />
        <meta name="bingbot" content="noindex, nofollow, noarchive, nosnippet" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={`https://legalcyfle.in/author/${author.sys.id}/${page}`} />
      </Head>
      
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
              author.fields?.avatar?.fields.file.url ||
                "https://picsum.photos/200/200",
            )}
            alt={author.fields.name}
            width={200}
            height={200}
            className="h-20 w-20 rounded-full border"
          />
        </div>
        <h3 className="text-4xl font-semibold text-green-500">
          {author.fields.name}
        </h3>
        <p className="max-w-xl text-base text-gray-600">{author.fields?.bio}</p>
      </FlexContainer>
      {articles.map((article) => (
        <ArticleCard article={article} key={article?.sys?.id} />
      ))}

      <FlexContainer variant="row-end" alignItems="center">
        {page > 1 ? (
          <a href={`/author/${author.sys.id}/${page - 1}`}>
            <Button variant={"secondary"}>Previous Page</Button>
          </a>
        ) : (
          <Button variant={"secondary"} disabled>
            Previous Page
          </Button>
        )}
        {nextPage ? (
          <span className="font-giest-mono text-sm font-semibold">
            Page {page}
          </span>
        ) : null}
        {nextPage ? (
          <a href={`/author/${author.sys.id}/${nextPage}`}>
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
    </>
  );
};

export default Index;

export const getStaticPaths = async () => {
  const authors = await client.getEntries({
    content_type: "author",
    select: ["sys.id"],
  });

  const paths = await Promise.all(
    authors.items.map(async (item) => {
      const totalArticles = await client.getEntries({
        content_type: "blogPage",
        "fields.authors.sys.id[in]": [item.sys.id],
        select: ["sys.id"],
        limit: 1,
      });
      const totalPages = Math.ceil(totalArticles.total / 5);
      return Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
        return {
          params: {
            id: item.sys.id,
            page: page.toString(),
          },
        };
      });
    }),
  );
  return {
    paths: paths.flat(),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const authorId = ctx.params?.id;
  let page = parseInt(ctx.params?.page as string) || 1;
  const author = await client.getEntry(authorId as string);
  const articles = await client.getEntries({
    content_type: "blogPage",
    "fields.authors.sys.id[in]": [author?.sys.id],
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
    // Pagination
    limit: 5,
    skip: (page - 1) * 5,
    // Sort
    order: ["-sys.createdAt"],
  });

  console.log("Author Articles: ", articles.items);

  const nextPage = articles.total > page * 5 ? page + 1 : null;
  const safeJsonArticle = JSON.parse(safeJsonStringify(articles.items));

  return {
    props: {
      articles: safeJsonArticle,
      author: author,
      page: page,
      nextPage: nextPage,
    },
  };
};
