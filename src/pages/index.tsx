import AdWrapper from "@/components/AdWrapper";
import ArticleCard from "@/components/ArticleCard";
import FlexContainer from "@/components/FlexContainer";
import Heading from "@/components/Heading";
import { Badge } from "@/components/ui/badge";
import { SocialLinks } from "@/lib/constants";
import client from "@/lib/contentful";
import { cn, estimateReadingTime, formatImageLink } from "@/lib/utils";
import { Author } from "@/types/contentful/author";
import { BlogEntry } from "@/types/contentful/blog";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import { Document } from "@contentful/rich-text-types";
import { Divider } from "@nextui-org/react";
import dayjs from "dayjs";
import tz from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Script from "next/script";
import safeJsonStringify from "safe-json-stringify";
import {
  Autoplay,
  Controller,
  Mousewheel,
  Navigation,
  Pagination,
  Parallax,
  Thumbs,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const DynamicAdWrapper = dynamic(() => import("../components/DynamicAd"), {
  ssr: false,
  loading: () => (
    <div style={{ width: "100%", minWidth: "250px", height: "100px" }} />
  ),
});

dayjs.extend(utc);
dayjs.extend(tz);

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
    <main className="flex flex-col items-center justify-center gap-14 py-5 pb-20 *:w-full">
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
      {/* <AdWrapper
        data-ad-format="fluid"
        data-ad-layout-key="-es-7n+gf+bp-16h"
        data-ad-slot="7648124020"
      /> */}
      <div className="flex flex-col gap-5 px-3 md:px-5 lg:h-[500px] lg:flex-row lg:px-10">
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          modules={[
            Autoplay,
            Mousewheel,
            Parallax,
            Thumbs,
            Controller,
            Navigation,
            Pagination,
          ]}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          allowTouchMove
          loop={true}
          breakpoints={{
            640: {
              spaceBetween: 30,
            },
            768: {
              spaceBetween: 40,
            },
            1024: {
              spaceBetween: 50,
            },
          }}
          onSlideChange={() => {}}
          onSwiper={(swiper) => {}}
          className="h-[300px] w-full overflow-hidden rounded-none sm:h-[400px] md:h-[450px] lg:h-full lg:flex-1"
        >
          {data?.topArticles?.map((article: BlogEntry) => {
            const thumbnail =
              article?.fields?.image?.fields?.file?.url ||
              "https://picsum.photos/500/500";
            return (
              <SwiperSlide
                key={article.sys.id}
                className="relative h-full w-full overflow-hidden"
              >
                <a
                  href={article.fields?.slug || "#"}
                  className="group block h-full w-full"
                >
                  <Image
                    src={formatImageLink(thumbnail)}
                    alt="LegalCyfle"
                    width={1280}
                    height={720}
                    className="z-10 h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                  />
                  <FlexContainer
                    variant="column-start"
                    gap="sm"
                    className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pt-20 sm:p-6 sm:pt-32"
                  >
                    <FlexContainer
                      variant="row-start"
                      className="mb-2 gap-2 sm:mb-3"
                    >
                      {article.fields.category?.slice(0, 1).map((category) => (
                        <Badge
                          key={category.sys.id}
                          className="border-0 bg-transparent px-0 py-0 text-xs font-bold uppercase tracking-wider text-blue-400"
                        >
                          {category.fields.name}
                        </Badge>
                      ))}
                    </FlexContainer>
                    <p className="inline-block max-w-none text-lg font-bold leading-tight text-white sm:text-2xl md:text-3xl lg:text-4xl">
                      {article.fields?.title}
                    </p>
                    <FlexContainer
                      variant="row-start"
                      alignItems="center"
                      wrap="wrap"
                      className="mt-2 gap-2 sm:mt-4 sm:gap-3"
                    >
                      <FlexContainer
                        alignItems="center"
                        wrap="wrap"
                        className="gap-2 sm:gap-3"
                      >
                        <p className="text-xs font-bold uppercase tracking-wider text-green-400">
                          {article?.fields?.authors
                            .slice(0, 1)
                            .map((author) => {
                              return author.fields.name;
                            })
                            .join(", ")}
                        </p>
                        <span className="hidden text-xs font-bold text-white/60 sm:inline">
                          •
                        </span>
                        <p className="text-xs font-medium uppercase tracking-wider text-white/80">
                          {article?.fields?.date
                            ? dayjs(article?.fields?.date)
                                .tz("Asia/Kolkata")
                                .format("MMM DD")
                            : "Date not available"}
                        </p>
                        <span className="hidden text-xs font-bold text-white/60 sm:inline">
                          •
                        </span>
                        <p className="hidden text-xs font-medium uppercase tracking-wider text-white/80 sm:block">
                          {estimateReadingTime(
                            documentToHtmlString(
                              article?.fields?.body as Document,
                            ),
                          )}{" "}
                          min read
                        </p>
                      </FlexContainer>
                    </FlexContainer>
                  </FlexContainer>
                </a>
              </SwiperSlide>
            );
          })}
        </Swiper>
        {data?.employeeOfTheMonth &&
          data?.employeeOfTheMonth?.fields?.authors?.length > 0 && (
            <div className="flex flex-col gap-5 bg-white dark:bg-gray-900 lg:h-full lg:min-h-[500px] lg:w-[350px]">
              <div className="pb-2">
                <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">
                  Co-ordinator of the Month
                </h3>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {data?.employeeOfTheMonth?.fields?.month}
                </p>
              </div>
              <div className="flex-1 space-y-4 overflow-y-auto">
                {data?.employeeOfTheMonth?.fields?.authors.map((author) => (
                  <Link
                    href={`/author/${author.sys.id}`}
                    key={author.sys.id}
                    className="flex items-start gap-4 rounded p-2 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <Image
                      src={formatImageLink(
                        author.fields?.avatar?.fields?.file?.url ||
                          "https://picsum.photos/200/200",
                      )}
                      alt={author.fields.name}
                      width={100}
                      height={100}
                      className="h-16 w-16 shrink-0 object-cover"
                    />
                    <div className="flex-1">
                      <p className="mb-2 text-lg font-bold leading-tight text-gray-900 dark:text-white">
                        {author.fields.name}
                      </p>
                      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                        {author.fields.bio.length > 60
                          ? `${author.fields.bio.slice(0, 60)}...`
                          : author.fields.bio}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        {/* <div className="md:flexw-[300px] hidden">
          <AdWrapper
            data-ad-format="fluid"
            data-ad-layout-key="-es-7n+gf+bp-16h"
            data-ad-slot="7648124020"
          />
        </div> */}
        {/* <AdWrapper
            data-ad-layout="in-article"
            data-ad-format="fluid"
            data-ad-slot="5536160107"
          />
          <AdWrapper
            data-ad-layout="in-article"
            data-ad-format="fluid"
            data-ad-slot="5536160107"
          /> */}
        {/* <div className="row-span-3 hidden h-full min-w-[325px] rounded-xl bg-zinc-100 px-3 py-2 text-sm font-medium dark:bg-zinc-800 lg:flex">
         
        </div> */}
      </div>
      <FlexContainer
        variant="column-start"
        gap="lg"
        className="px-3 md:px-5 lg:px-10"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Connect with us on Social Media
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 sm:gap-4">
          {Object.keys(SocialLinks).map((key) => {
            const Icon = SocialLinks[key].icon;
            return (
              <Link
                href={SocialLinks[key].url}
                target="_blank"
                key={key}
                className="group flex items-center justify-center gap-3 border border-gray-200 bg-white px-4 py-6 font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-800 sm:flex-col sm:gap-2 sm:py-8"
              >
                <Icon className="h-6 w-6 fill-current transition-transform duration-200 group-hover:scale-110" />
                <span className="text-sm font-bold uppercase tracking-wider">
                  {key}
                </span>
              </Link>
            );
          })}
        </div>
      </FlexContainer>
      <AdWrapper
        data-ad-format="fluid"
        data-ad-layout-key="-et-7n+gx+cc-19b"
        data-ad-slot="1973122915"
      />
      <FlexContainer variant="column-start" className="px-3 md:px-5 lg:px-10">
        <h3 className="px-2 text-4xl font-semibold md:mb-5 md:mt-10">
          Trending Articles
        </h3>
        <div className="flex flex-col gap-5 md:flex-row">
          <div className="flex flex-1 flex-col gap-5">
            {data?.trendingArticles?.map((article: BlogEntry) => {
              return <ArticleCard article={article} key={article.sys.id} />;
            })}
          </div>
          <div className="w-[300px]">
            <AdWrapper
              data-ad-layout="in-article"
              data-ad-format="fluid"
              data-ad-slot="5536160107"
            />
          </div>
        </div>
      </FlexContainer>
      {/* <FlexContainer variant="row-center">
        <DynamicAdWrapper
          slot="1973122915"
          format="fluid"
          layoutKey="-et-7n+gx+cc-19b"
        />
      </FlexContainer> */}
      <FlexContainer variant="column-start" className="px-3 md:px-5 lg:px-10">
        <h3 className="px-2 text-4xl font-semibold md:mb-5 md:mt-10">
          Latest Articles
        </h3>
        <div className="flex flex-col gap-5 md:flex-row">
          <div className="flex flex-1 flex-col gap-5">
            {data?.latestArticles?.map((article: BlogEntry) => {
              return <ArticleCard article={article} key={article.sys.id} />;
            })}
          </div>
          <div className="w-[300px]">
            <AdWrapper
              data-ad-layout="in-article"
              data-ad-format="fluid"
              data-ad-slot="5536160107"
            />
          </div>
        </div>
      </FlexContainer>
      <AdWrapper
        data-ad-format="fluid"
        data-ad-layout-key="-es-7n+gf+bp-16h"
        data-ad-slot="7648124020"
      />
      <FlexContainer variant="column-start" className="px-3 md:px-5 lg:px-10">
        <h3 className="px-2 text-4xl font-semibold md:mb-5 md:mt-10">News</h3>
        <div className="flex flex-col gap-5 md:flex-row">
          <div className="flex flex-1 flex-col gap-5">
            {data?.news?.map((article: BlogEntry) => {
              return <ArticleCard article={article} key={article.sys.id} />;
            })}
          </div>
          <div className="w-[300px]">
            {" "}
            <div className="col-span-2">
              <AdWrapper
                data-ad-layout="in-article"
                data-ad-format="fluid"
                data-ad-slot="5536160107"
              />
            </div>
          </div>
        </div>
      </FlexContainer>
      <AdWrapper
        data-ad-format="fluid"
        data-ad-layout-key="-es-7n+gf+bp-16h"
        data-ad-slot="7648124020"
      />
      <FlexContainer variant="column-start" className="px-3 md:px-5 lg:px-10">
        <h3 className="px-2 text-4xl font-semibold md:mb-5 md:mt-10">
          Case Analysis
        </h3>
        <div className="flex flex-col gap-5 md:flex-row">
          <div className="flex flex-1 flex-col gap-5">
            {data?.caseAnalysis?.map((article: BlogEntry) => {
              return <ArticleCard article={article} key={article.sys.id} />;
            })}
          </div>
          <div>
            {" "}
            <div className="w-[300px]">
              <AdWrapper
                data-ad-layout="in-article"
                data-ad-format="fluid"
                data-ad-slot="5536160107"
              />
            </div>
          </div>
        </div>
      </FlexContainer>
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
    revalidate: 3600, // Revalidate every hour (3600 seconds) or on-demand via webhook
  };
};
