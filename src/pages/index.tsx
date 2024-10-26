import ArticleCard from "@/components/ArticleCard";
import FlexContainer from "@/components/FlexContainer";
import { Badge } from "@/components/ui/badge";
import client from "@/lib/contentful";
import { estimateReadingTime, formatImageLink } from "@/lib/utils";
import { BlogEntry } from "@/types/contentful/blog";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import { Document } from "@contentful/rich-text-types";
import { Divider } from "@nextui-org/react";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
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

interface HomeProps {
  data: {
    latestArticles: BlogEntry[];
    topArticles: BlogEntry[];
    caseAnalysis: BlogEntry[];
    news: BlogEntry[];
  };
}

export default function Home({ data }: HomeProps) {
  console.log(data);
  const router = useRouter();

  return (
    <main className="flex flex-col items-start justify-start gap-10 py-5 pb-20 *:w-full">
      <div className="grid max-h-[75vh] grid-cols-3 grid-rows-3 gap-5 px-3 md:px-5 lg:grid-cols-4 lg:px-10">
        <div className="col-span-3 row-span-3">
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
            onSlideChange={() => console.log("slide change")}
            onSwiper={(swiper) => console.log(swiper)}
            className="overflow-hidden rounded-xl"
          >
            {data?.topArticles?.map((article: BlogEntry) => {
              const thumbnail =
                article?.fields?.image?.fields?.file?.url ||
                "https://picsum.photos/500/500";
              return (
                <SwiperSlide
                  key={article.sys.id}
                  className="relative h-[80vh] max-h-[300px] overflow-hidden rounded-xl md:max-h-[450px]"
                >
                  <Link href={article.fields?.slug || "#"} className="group">
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
                            {dayjs(article?.fields?.date).format(
                              "hh:mm A - MMMM DD, YYYY",
                            )}
                          </p>
                          <Divider
                            orientation="vertical"
                            className="h-4 w-[1.5px] bg-white"
                          />
                          <p className="text-sm font-medium text-white md:text-medium">
                            By {article?.fields?.author?.fields?.name}
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
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
        <div className="hidden h-full w-full rounded-xl bg-zinc-100 px-3 py-2 text-sm font-medium dark:bg-zinc-800 lg:flex">
          ADVERTS
        </div>
        <div className="h-full w-full rounded-xl bg-zinc-100 dark:bg-zinc-800"></div>
        <div className="h-full w-full rounded-xl bg-zinc-100 dark:bg-zinc-800"></div>
      </div>
      <FlexContainer variant="column-start" className="px-3 md:px-5 lg:px-10">
        <h3 className="px-2 text-4xl font-semibold md:mb-5 md:mt-10">
          Latest Articles
        </h3>
        <div className="grid grid-cols-5 gap-5">
          <div className="col-span-5 grid gap-y-7 md:col-span-4">
            {data?.latestArticles?.map((article: BlogEntry) => {
              return <ArticleCard article={article} key={article.sys.id} />;
            })}
          </div>
          <FlexContainer
            variant="row-center"
            className="hidden h-full w-full rounded-xl p-5 md:flex"
          >
            ADVERTS
          </FlexContainer>
        </div>
      </FlexContainer>
      <FlexContainer variant="column-start" className="px-3 md:px-5 lg:px-10">
        <h3 className="px-2 text-4xl font-semibold md:mb-5 md:mt-10">News</h3>
        <div className="grid grid-cols-5 gap-5">
          <div className="col-span-5 grid gap-y-7 md:col-span-4">
            {data?.news?.map((article: BlogEntry) => {
              return <ArticleCard article={article} key={article.sys.id} />;
            })}
          </div>
          <FlexContainer
            variant="row-center"
            className="hidden h-full w-full rounded-xl p-5 md:flex"
          >
            ADVERTS
          </FlexContainer>
        </div>
      </FlexContainer>
      <FlexContainer variant="column-start" className="px-3 md:px-5 lg:px-10">
        <h3 className="px-2 text-4xl font-semibold md:mb-5 md:mt-10">
          Case Analysis
        </h3>
        <div className="grid grid-cols-5 gap-5">
          <div className="col-span-5 grid gap-y-7 md:col-span-4">
            {data?.caseAnalysis?.map((article: BlogEntry) => {
              return <ArticleCard article={article} key={article.sys.id} />;
            })}
          </div>
          <FlexContainer
            variant="row-center"
            className="hidden h-full w-full rounded-xl p-5 md:flex"
          >
            ADVERTS
          </FlexContainer>
        </div>
      </FlexContainer>
    </main>
  );
}

export const getStaticProps = async () => {
  const articles = await client.getEntries({
    content_type: "blogPage",
    order: ["-sys.createdAt"],
    limit: 3,
  });
  const safeJsonArticles = JSON.parse(safeJsonStringify(articles.items));
  const caseAnalysis = await client.getEntries({
    content_type: "blogPage",
    "fields.category.sys.id[in]": ["7aq38iMXGWwYnP61tHxRfb"],
    limit: 3,
  });
  const safeJsonCaseAnalysis = JSON.parse(
    safeJsonStringify(caseAnalysis.items),
  );
  const news = await client.getEntries({
    content_type: "blogPage",
    "fields.category.sys.id[in]": ["2gwE6uMGZBUL17DtfmRjC4"],
    limit: 3,
  });
  const safeJsonNews = JSON.parse(safeJsonStringify(news.items));
  const topArticles = await client.getEntries({
    content_type: "topArticles",
    include: 3,
    order: ["-sys.createdAt"],
  });
  const safeJsonTopArticles = JSON.parse(
    safeJsonStringify(topArticles?.items[0]?.fields?.articles as BlogEntry[]),
  );
  return {
    props: {
      data: {
        latestArticles: safeJsonArticles,
        topArticles: safeJsonTopArticles,
        caseAnalysis: safeJsonCaseAnalysis,
        news: safeJsonNews,
      },
    },
  };
};
