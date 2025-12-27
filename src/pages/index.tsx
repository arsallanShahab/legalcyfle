import AdWrapper from "@/components/AdWrapper";
import ArticleListSection from "@/components/home/ArticleListSection";
import HeroSection from "@/components/home/HeroSection";
import SocialMediaSection from "@/components/home/SocialMediaSection";
import client from "@/lib/contentful";
import { Author } from "@/types/contentful/author";
import { BlogEntry } from "@/types/contentful/blog";
import Head from "next/head";
import { useRouter } from "next/router";
import safeJsonStringify from "safe-json-stringify";

interface HomeProps {
  data: {
    latestArticles: BlogEntry[];
    topArticles: BlogEntry[];
    caseAnalysis: BlogEntry[];
    news: BlogEntry[];
    employeeOfTheMonth: {
      fields: {
        title: string;
        authors: Author[];
        month: string;
      };
      sys: { id: string; type: "Entry" };
    } | null;
    trendingArticles: BlogEntry[];
  };
}

export default function Home({ data }: HomeProps) {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center gap-8 py-6 pb-12 *:w-full">
      <Head>
        <title>LegalCyfle - iuris occasio omnibus</title>
        <meta name="description" content="iuris occasio omnibus" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "CollectionPage",
                  "@id": "https://legalcyfle.in/",
                  url: "https://legalcyfle.in/",
                  name: "LegalCyfle - iuris occasio omnibus",
                  isPartOf: { "@id": "https://legalcyfle.in/#website" },
                  about: { "@id": "https://legalcyfle.in/#organization" },
                  description: "iuris occasio omnibus",
                  breadcrumb: { "@id": "https://legalcyfle.in/#breadcrumb" },
                  inLanguage: "en-US",
                },
                {
                  "@type": "BreadcrumbList",
                  "@id": "https://legalcyfle.in/#breadcrumb",
                  itemListElement: [
                    { "@type": "ListItem", position: 1, name: "Home" },
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": "https://legalcyfle.in/#website",
                  url: "https://legalcyfle.in/",
                  name: "LegalCyfle",
                  description: "iuris occasio omnibus",
                  publisher: { "@id": "https://legalcyfle.in/#organization" },
                  potentialAction: [
                    {
                      "@type": "SearchAction",
                      target: {
                        "@type": "EntryPoint",
                        urlTemplate:
                          "https://legalcyfle.in/search?q={search_term_string}",
                      },
                      "query-input": {
                        "@type": "PropertyValueSpecification",
                        valueRequired: true,
                        valueName: "search_term_string",
                      },
                    },
                  ],
                  inLanguage: "en-US",
                },
                {
                  "@type": "Organization",
                  "@id": "https://legalcyfle.in/#organization",
                  name: "LegalCyfle",
                  url: "https://legalcyfle.in/",
                  logo: {
                    "@type": "ImageObject",
                    inLanguage: "en-US",
                    "@id": "https://legalcyfle.in/#/schema/logo/image/",
                    url: "https://legalcyfle.in/logo-black.png",
                    contentUrl: "https://legalcyfle.in/logo-black.png",
                    width: 1500,
                    height: 1500,
                    caption: "LegalCyfle",
                  },
                  image: {
                    "@id": "https://legalcyfle.in/#/schema/logo/image/",
                  },
                  sameAs: [
                    "https://www.facebook.com/profile.php?id=61559661011805",
                    "https://www.linkedin.com/company/legalcyfle-in/",
                    "https://www.instagram.com/legalcyfle/?hl=en",
                  ],
                },
              ],
            }),
          }}
        ></script>
      </Head>

      <div className="mx-auto max-w-7xl">
        {" "}
        <HeroSection
          topArticles={data?.topArticles}
          employeeOfTheMonth={data?.employeeOfTheMonth}
        />
        <SocialMediaSection />
        <AdWrapper
          data-ad-format="fluid"
          data-ad-layout-key="-et-7n+gx+cc-19b"
          data-ad-slot="1973122915"
        />
        <ArticleListSection
          title="Trending Articles"
          articles={data?.trendingArticles}
        />
        <ArticleListSection
          title="Latest Articles"
          articles={data?.latestArticles}
        />
        <AdWrapper
          data-ad-format="fluid"
          data-ad-layout-key="-es-7n+gf+bp-16h"
          data-ad-slot="7648124020"
        />
        <ArticleListSection title="News" articles={data?.news} />
        <AdWrapper
          data-ad-format="fluid"
          data-ad-layout-key="-es-7n+gf+bp-16h"
          data-ad-slot="7648124020"
        />
        <ArticleListSection
          title="Case Analysis"
          articles={data?.caseAnalysis}
        />
      </div>
    </main>
  );
}

export const getStaticProps = async () => {
  const articles = await client.getEntries({
    content_type: "blogPage",
    order: ["-sys.createdAt"],
    "fields.category.sys.id[in]": [
      "2uezIzO3zSYohdj6yen0xm",
      "2pZtFZgrtxrmJJaH1cBoIm",
      "2RKXDO21lw1yAlZb8gxjZH",
      "6sRbgihUKlv69O5GPGQWyf",
      "4Lp1Jl3boXVkDlBV8KzUMj",
    ],
    include: 1,
    limit: 4,
    select: ["fields", "sys.id"],
  });
  const safeJsonArticles = JSON.parse(safeJsonStringify(articles.items));
  const trendingArticles = await client.getEntries({
    content_type: "blogPage",
    "fields.category.sys.id[in]": ["76yd6AyaglQNpBUznpzxIP"],
    include: 1,
    limit: 4,
    order: ["-sys.createdAt"],
    select: ["fields", "sys.id"],
  });
  const safeJsonTrendingArticles = JSON.parse(
    safeJsonStringify(trendingArticles.items),
  );
  const caseAnalysis = await client.getEntries({
    content_type: "blogPage",
    "fields.category.sys.id[in]": ["7aq38iMXGWwYnP61tHxRfb"],
    limit: 3,
    include: 1,
    select: ["fields", "sys.id"],
  });
  const safeJsonCaseAnalysis = JSON.parse(
    safeJsonStringify(caseAnalysis.items),
  );
  const news = await client.getEntries({
    content_type: "blogPage",
    "fields.category.sys.id[in]": ["2gwE6uMGZBUL17DtfmRjC4"],
    include: 1,
    limit: 3,
    select: ["fields", "sys.id"],
  });
  const safeJsonNews = JSON.parse(safeJsonStringify(news.items));
  const topArticles = await client.getEntries({
    content_type: "topArticles",
    include: 2,
    order: ["-sys.createdAt"],
    select: ["fields", "sys.id"],
  });
  const safeJsonTopArticles = JSON.parse(
    safeJsonStringify(topArticles?.items[0]?.fields?.articles as BlogEntry[]),
  );

  const employeeOfTheMonth = await client.getEntries({
    content_type: "employeeOfTheMonth",
    order: ["-sys.createdAt"],
    include: 1,
    limit: 1,
    select: ["fields", "sys.id"],
  });
  return {
    props: {
      data: {
        latestArticles: safeJsonArticles,
        topArticles: safeJsonTopArticles,
        caseAnalysis: safeJsonCaseAnalysis,
        news: safeJsonNews,
        employeeOfTheMonth: employeeOfTheMonth.items[0] || null,
        trendingArticles: safeJsonTrendingArticles,
      },
    },
    revalidate: 43200, // Revalidate every 12 hour (43200 seconds) or on-demand via webhook
  };
};
