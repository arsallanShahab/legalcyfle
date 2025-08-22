import AdWrapper from "@/components/AdWrapper";
import ArticleCard from "@/components/ArticleCard";
import FlexContainer from "@/components/FlexContainer";
import { Button } from "@/components/ui/button";
import Wrapper from "@/components/Wrapper";
import client from "@/lib/contentful";
import { removeCircularReferences } from "@/lib/utils";
import { BlogEntries } from "@/types/contentful/blog";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import safeJsonStringify from "safe-json-stringify";

type Props = {
  data: BlogEntries;
  nextPage: number | null;
  slug: string;
  categoryName: string;
  categoryDescription?: string;
};

const Index = (props: Props) => {
  const categoryName =
    props.categoryName ||
    props.data[0]?.fields?.category[0]?.fields.name ||
    "Category";
  const categoryDescription =
    props.categoryDescription ||
    `Browse ${categoryName} articles on LegalCyfle - Expert insights, analysis, and updates in ${categoryName.toLowerCase()}.`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `https://legalcyfle.in/category/${props.slug}/`,
        url: `https://legalcyfle.in/category/${props.slug}/`,
        name: `${categoryName} - LegalCyfle`,
        description: categoryDescription,
        isPartOf: { "@id": "https://legalcyfle.in/#website" },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://legalcyfle.in/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: categoryName,
              item: `https://legalcyfle.in/category/${props.slug}/`,
            },
          ],
        },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: props.data.map((article, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `https://legalcyfle.in/${article.fields.slug}/`,
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://legalcyfle.in/#website",
        url: "https://legalcyfle.in/",
        name: "LegalCyfle",
        description:
          "Legal insights, career guidance, and educational resources",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://legalcyfle.in/search?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <>
      <Head>
        <title>{`${categoryName} - LegalCyfle`}</title>
        <meta name="description" content={categoryDescription} />
        <meta
          name="keywords"
          content={`${categoryName.toLowerCase()}, legal articles, law, legal insights, legal career, legal education`}
        />
        <link
          rel="canonical"
          href={`https://legalcyfle.in/category/${props.slug}/`}
        />

        {/* Open Graph tags */}
        <meta property="og:title" content={`${categoryName} - LegalCyfle`} />
        <meta property="og:description" content={categoryDescription} />
        <meta
          property="og:url"
          content={`https://legalcyfle.in/category/${props.slug}/`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="LegalCyfle" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`${categoryName} - LegalCyfle`} />
        <meta name="twitter:description" content={categoryDescription} />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <Wrapper className="pt-2.5 md:pt-2.5">
        <AdWrapper
          data-ad-slot="4210005765"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
        <h1 className="font-giest-sans text-4xl">{categoryName}</h1>
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
    </>
  );
};

export const getStaticPaths = async () => {
  try {
    // Only pre-build the most popular categories
    const categories = await client.getEntries({
      content_type: "blogCategory",
      select: ["fields.slug"],
      limit: 5, // Only pre-build top 5 categories
    });

    const paths = categories.items.map((item) => ({
      params: { slug: item.fields.slug },
    }));

    return {
      paths,
      fallback: "blocking", // Generate other categories on-demand
    };
  } catch (error) {
    console.error("Error in getStaticPaths:", error);
    return {
      paths: [],
      fallback: "blocking",
    };
  }
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  try {
    const slug = ctx.params?.slug;

    if (!slug) {
      return { notFound: true };
    }

    const category = await client
      .getEntries({
        content_type: "blogCategory",
        "fields.slug": slug,
        select: ["sys.id", "fields.name", "fields.slug"],
      })
      .catch((error) => {
        console.error("Error fetching category:", error);
        return { items: [] };
      });

    if (!category?.items?.length) {
      return { notFound: true };
    }

    const articles = await client
      .getEntries({
        content_type: "blogPage",
        "fields.category.sys.id[in]": [category?.items[0]?.sys.id],
        select: [
          "fields.title",
          "fields.slug",
          "fields.description",
          "fields.date",
          "fields.image",
          "fields.category",
          "fields.authors",
          "sys.id",
          "sys.createdAt",
        ],
        limit: 5,
        order: ["-sys.createdAt"],
      })
      .catch((error) => {
        console.error("Error fetching articles:", error);
        return { items: [], total: 0 };
      });

    const nextPage = articles.total > 5 ? 2 : null;

    let safeJsonArticle = [];
    try {
      safeJsonArticle = JSON.parse(safeJsonStringify(articles.items));
    } catch (error) {
      console.error("Error stringifying articles:", error);
      safeJsonArticle = articles.items;
    }

    return {
      props: {
        data: safeJsonArticle,
        nextPage,
        slug,
        categoryName: category.items[0]?.fields?.name || "Category",
        categoryDescription:
          category.items[0]?.fields?.description ||
          `Browse ${category.items[0]?.fields?.name || "category"} articles on LegalCyfle - Expert insights, analysis, and updates in ${String(category.items[0]?.fields?.name || "category").toLowerCase()}.`,
      },
      // ISR: Revalidate every 30 minutes
      revalidate: 1800,
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return { notFound: true };
  }
};

export default Index;
