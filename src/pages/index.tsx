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
      <div className="grid max-h-[75vh] grid-cols-3 grid-rows-3 gap-5 px-5 md:px-10 lg:grid-cols-4">
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
                  className="relative h-[80vh] max-h-[580px] overflow-hidden rounded-xl"
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
                      <p className="inline-block max-w-xl text-3xl font-medium text-white">
                        {article.fields?.title}
                      </p>
                      <FlexContainer variant="row-between" alignItems="center">
                        <FlexContainer alignItems="center">
                          <p className="text-medium font-medium text-white">
                            {dayjs(article?.fields?.date).format(
                              "hh:mm A - MMMM DD, YYYY",
                            )}
                          </p>
                          <Divider
                            orientation="vertical"
                            className="h-4 w-[1.5px] bg-white"
                          />
                          <p className="text-medium font-medium text-white">
                            By {article?.fields?.author?.fields?.name}
                          </p>
                        </FlexContainer>
                        <p className="font-medium text-white">
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
      <FlexContainer variant="column-start" className="px-5 md:px-10">
        <h3 className="mb-5 mt-10 font-rubik text-4xl font-semibold">
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
      <FlexContainer variant="column-start" className="px-5 md:px-10">
        <h3 className="mb-5 mt-10 font-rubik text-4xl font-semibold">News</h3>
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
      <FlexContainer variant="column-start" className="px-5 md:px-10">
        <h3 className="mb-5 mt-10 font-rubik text-4xl font-semibold">
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
  const caseAnalysis = await client.getEntries({
    content_type: "blogPage",
    "fields.category.sys.id[in]": ["7aq38iMXGWwYnP61tHxRfb"],
    limit: 3,
  });
  const news = await client.getEntries({
    content_type: "blogPage",
    "fields.category.sys.id[in]": ["2gwE6uMGZBUL17DtfmRjC4"],
    limit: 3,
  });
  const topArticles = await client.getEntries({
    content_type: "topArticles",
    include: 3,
    order: ["-sys.createdAt"],
  });
  return {
    props: {
      data: {
        latestArticles: articles.items,
        topArticles: topArticles?.items[0]?.fields.articles,
        caseAnalysis: caseAnalysis.items,
        news: news.items,
      },
    },
  };
};
