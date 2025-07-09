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
      <div className="flex flex-wrap gap-5 px-3 md:flex-nowrap md:px-5 lg:max-h-[80vh] lg:px-10">
        <Swiper
          spaceBetween={50}
          // slidesPerView={1}
          modules={[
            Autoplay,
            Mousewheel,
            Parallax,
            Thumbs,
            Controller,
            Navigation,
            Pagination,
          ]}
          pagination={{}}
          // effect="fade"
          autoplay={{
            delay: 3000,
            disableOnInteraction: true,
          }}
          allowTouchMove
          loop={true}
          onSlideChange={() => {}}
          onSwiper={(swiper) => {}}
          className="flex overflow-hidden rounded-xl"
        >
          {data?.topArticles?.map((article: BlogEntry) => {
            const thumbnail =
              article?.fields?.image?.fields?.file?.url ||
              "https://picsum.photos/500/500";
            return (
              <SwiperSlide
                key={article.sys.id}
                className="relative overflow-hidden rounded-xl md:max-h-[450px] lg:h-[80vh]"
              >
                <a href={article.fields?.slug || "#"} className="group">
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
                    className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-green-950 to-transparent p-5 pt-32"
                  >
                    <p className="inline-block max-w-xl text-xl font-medium text-white md:text-3xl">
                      {article.fields?.title}
                    </p>
                    <FlexContainer
                      variant="row-between"
                      alignItems="center"
                      wrap="wrap"
                    >
                      <FlexContainer alignItems="center">
                        <p className="text-sm font-medium text-white md:text-medium">
                          {article?.fields?.date
                            ? dayjs(article?.fields?.date)
                                .tz("Asia/Kolkata")
                                .format("MMMM DD, YYYY")
                            : "Date not available"}
                        </p>
                        <Divider
                          orientation="vertical"
                          className="h-4 w-[1.5px] bg-white"
                        />
                        <p className="text-sm font-medium text-white md:text-medium">
                          By{" "}
                          {article?.fields?.authors
                            .map((author) => {
                              return author.fields.name;
                            })
                            .join(", ")}
                        </p>
                      </FlexContainer>
                      <p className="text-sm font-medium text-white md:text-medium">
                        {estimateReadingTime(
                          documentToHtmlString(
                            article?.fields?.body as Document,
                          ),
                        )}{" "}
                        min read
                      </p>
                    </FlexContainer>
                  </FlexContainer>
                </a>
              </SwiperSlide>
            );
          })}
        </Swiper>
        {data?.employeeOfTheMonth &&
          data?.employeeOfTheMonth?.fields?.authors?.length > 0 && (
            <div className="flex h-full min-w-[300px] flex-col gap-3 rounded-xl bg-zinc-100 p-3 dark:bg-zinc-800">
              <h3 className="text-xl font-semibold">
                Co-ordinator of the Month
              </h3>
              <h3 className="text-base font-semibold">
                {data?.employeeOfTheMonth?.fields?.month}
              </h3>
              {data?.employeeOfTheMonth?.fields?.authors?.map((author) => (
                <Link
                  href={`/author/${author.sys.id}`}
                  key={author.sys.id}
                  className="flex items-center gap-3 rounded-xl bg-zinc-200 p-3 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600"
                >
                  <Image
                    src={formatImageLink(
                      author.fields?.avatar?.fields?.file?.url ||
                        "https://picsum.photos/200/200",
                    )}
                    alt={author.fields.name}
                    width={100}
                    height={100}
                    className="h-16 w-16 shrink-0 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-lg font-semibold">
                      {author.fields.name}
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {author.fields.bio.length > 70
                        ? `${author.fields.bio.slice(0, 70)}...`
                        : author.fields.bio}
                    </p>
                  </div>
                </Link>
              ))}
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
        gap="5xl"
        className="px-3 md:px-5 lg:px-10"
      >
        <Heading>Connect with us on Social Media</Heading>
        <div className="grid grid-cols-5 gap-2.5 sm:gap-5">
          {Object.keys(SocialLinks).map((key) => {
            const Icon = SocialLinks[key].icon;
            return (
              <Link
                href={SocialLinks[key].url}
                target="_blank"
                key={key}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl bg-zinc-100 px-2 py-5 font-giest-sans text-xl font-medium text-zinc-900 sm:py-10",
                  key === "facebook" &&
                    "bg-[#0866FF] text-white hover:bg-[#0052CC]",
                  key === "instagram" &&
                    "bg-[#FF0069] text-white hover:bg-[#D6005A]",
                  key === "linkedin" &&
                    "bg-[#0077b5] text-white hover:bg-[#006097]",
                  key === "telegram" &&
                    "bg-[#26A5E4] text-white hover:bg-[#1C8DD4]",
                  key === "whatsapp" &&
                    "bg-[#25D366] text-white hover:bg-[#128C7E]",
                )}
              >
                <Icon className="h-7 w-7 fill-current" />
                <span className="hidden md:block">{key}</span>
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
    ],
    include: 1,
    limit: 4,
    select: ["fields", "sys.id"],
  });
  const safeJsonArticles = JSON.parse(safeJsonStringify(articles.items));
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
      },
    },
  };
};
