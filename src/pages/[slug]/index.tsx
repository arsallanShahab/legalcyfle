import AdWrapper from "@/components/AdWrapper";
import ArticleAuthor from "@/components/article/ArticleAuthor";
import ArticleContent from "@/components/article/ArticleContent";
import ArticleHeader from "@/components/article/ArticleHeader";
import ArticleSEO from "@/components/article/ArticleSEO";
import InteractionBar from "@/components/article/InteractionBar";
import RecommendedArticles from "@/components/article/RecommendedArticles";
import FlexContainer from "@/components/FlexContainer";
import client from "@/lib/contentful";
import { getDeviceId, updateDevicePreferences } from "@/lib/device-id";
import useGet from "@/lib/hooks/use-get";
import { estimateReadingTime } from "@/lib/utils";
import { BlogEntry } from "@/types/contentful/blog";
import {
  ApiResponse,
  DislikeResponse,
  HeartResponse,
  LikeResponse,
  MetricsResponse,
} from "@/types/global/api-response";
import { Comment, IArticle } from "@/types/global/article";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import { Document } from "@contentful/rich-text-types";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import dayjs from "dayjs";
import tz from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import {
  EmailIcon,
  FacebookIcon,
  LinkedinIcon,
  PinterestIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import safeJsonStringify from "safe-json-stringify";

dayjs.extend(utc);
dayjs.extend(tz);

type Props = {
  data: BlogEntry;
  recommendedArticles: BlogEntry[];
};

const Index = (props: Props) => {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [article, setArticle] = React.useState<IArticle | null>(null);
  const [deviceId, setDeviceId] = React.useState<string>("");

  // loading states
  const [likeLoading, setLikeLoading] = React.useState<boolean>(false);
  const [dislikeLoading, setDislikeLoading] = React.useState<boolean>(false);
  const [heartLoading, setHeartLoading] = React.useState<boolean>(false);
  const [isLoadingMetrics, setIsLoadingMetrics] =
    React.useState<boolean>(false);

  // like, dislike, heart states
  const [isLiked, setIsLiked] = React.useState<boolean | undefined>(false);
  const [isDisliked, setIsDisliked] = React.useState<boolean | undefined>(
    false,
  );
  const [isHearted, setIsHearted] = React.useState<boolean | undefined>(false);

  // like, dislike, heart counts
  const [likeCount, setLikeCount] = React.useState<number | undefined>(0);
  const [dislikeCount, setDislikeCount] = React.useState<number | undefined>(0);
  const [heartCount, setHeartCount] = React.useState<number | undefined>(0);

  const [comments, setComments] = React.useState<Comment[]>([]);

  const { getData, loading, data, error, refresh } = useGet<
    ApiResponse<MetricsResponse>
  >({ showToast: false });

  // Initialize device ID on component mount
  useEffect(() => {
    const id = getDeviceId();
    setDeviceId(id);
  }, []);

  const handleHeart = async () => {
    if (!deviceId) {
      return toast.error("Unable to process request");
    }
    try {
      setHeartLoading(true);
      const res = await fetch(`/api/articles/${props.data.fields.slug}/heart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deviceId }),
      });
      const data = (await res.json()) as ApiResponse<HeartResponse>;
      if (data.success) {
        setIsHearted(data.data?.isHearted);
        setHeartCount(data.data?.hearts);
        updateDevicePreferences(
          props.data.fields.slug,
          "heart",
          data.data?.isHearted || false,
        );
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const err = error as Error & { message: string };
      toast.error(err.message);
    } finally {
      setHeartLoading(false);
    }
  };

  const handleLike = async () => {
    if (!deviceId) {
      return toast.error("Unable to process request");
    }
    try {
      setLikeLoading(true);
      const res = await fetch(`/api/articles/${props.data.fields.slug}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deviceId }),
      });
      const data = (await res.json()) as ApiResponse<LikeResponse>;
      if (data.success) {
        setIsLiked(data.data?.isLiked);
        setLikeCount(data.data?.likes);
        updateDevicePreferences(
          props.data.fields.slug,
          "like",
          data.data?.isLiked || false,
        );
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const err = error as Error & { message: string };
      toast.error(err.message);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDislike = async () => {
    if (!deviceId) {
      return toast.error("Unable to process request");
    }
    try {
      setDislikeLoading(true);
      const res = await fetch(
        `/api/articles/${props.data.fields.slug}/dislike`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ deviceId }),
        },
      );
      const data = (await res.json()) as ApiResponse<DislikeResponse>;
      if (data.success) {
        setIsDisliked(data.data?.isDisliked);
        setDislikeCount(data.data?.dislikes);
        updateDevicePreferences(
          props.data.fields.slug,
          "dislike",
          data.data?.isDisliked || false,
        );
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const err = error as Error & { message: string };
      toast.error(err.message);
    } finally {
      setDislikeLoading(false);
    }
  };

  const thumbnail =
    props.data?.fields?.image?.fields?.file?.url ||
    "https://picsum.photos/500/500";

  useEffect(() => {
    if (deviceId) {
      // Use POST method to send deviceId
      setIsLoadingMetrics(true);
      fetch(`/api/articles/${props.data.fields.slug}/metrics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deviceId }),
      })
        .then((res) => res.json())
        .then((responseData) => {
          if (responseData.success) {
            setArticle(responseData.data?.article);
            setComments(responseData.data?.comments || []);
            setLikeCount(responseData.data?.like);
            setDislikeCount(responseData.data?.dislikes);
            setHeartCount(responseData.data?.hearts);
            setIsLiked(responseData.data?.isLiked);
            setIsDisliked(responseData.data?.isDisliked);
            setIsHearted(responseData.data?.isHearted);
          }
        })
        .catch((error) => {
          console.error("Error fetching metrics:", error);
        })
        .finally(() => {
          setIsLoadingMetrics(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data, deviceId]);

  const readingTime = estimateReadingTime(
    documentToHtmlString(props.data.fields.body as Document),
  );
  const articleContent = documentToHtmlString(
    props.data.fields.body as Document,
  );
  const wordCount = articleContent
    .replace(/<[^>]*>/g, "")
    .split(" ")
    .filter((word) => word.length > 0).length;
  const publishDate = props.data.fields.date || props.data.sys.createdAt;
  const modifiedDate = props.data.sys.updatedAt;

  return (
    <main className="relative min-h-screen bg-white dark:bg-black">
      <ArticleSEO
        article={props.data}
        metrics={article}
        url={`https://legalcyfle.in/${props.data.fields.slug}`}
      />

      <FlexContainer
        variant="column-start"
        className="mx-auto max-w-4xl px-4 py-10 pt-2.5 md:px-10 md:py-20 md:pt-2.5"
        gap="2xl"
      >
        <AdWrapper
          data-ad-format="fluid"
          data-ad-layout-key="-et-7n+gx+cc-19b"
          data-ad-slot="1973122915"
        />

        <ArticleHeader
          data={props.data}
          onShare={onOpen}
          publishDate={publishDate}
          modifiedDate={modifiedDate}
          wordCount={wordCount}
          readingTime={readingTime}
        />

        <ArticleContent data={props.data} thumbnail={thumbnail} />

        <InteractionBar
          article={article}
          isLoadingMetrics={isLoadingMetrics}
          likeLoading={likeLoading}
          dislikeLoading={dislikeLoading}
          heartLoading={heartLoading}
          isLiked={isLiked}
          isDisliked={isDisliked}
          isHearted={isHearted}
          likeCount={likeCount}
          dislikeCount={dislikeCount}
          heartCount={heartCount}
          error={error}
          onLike={handleLike}
          onDislike={handleDislike}
          onHeart={handleHeart}
        />

        <ArticleAuthor article={props.data} />

        <RecommendedArticles
          articles={props.recommendedArticles}
          currentCategory={{
            title: props.data.fields.category?.[0]?.fields?.name || "Legal",
            slug: props.data.fields.category?.[0]?.fields?.slug || "legal",
          }}
        />

        {/* Comments Section Placeholder */}
        <section id="comment" className="comments-section mt-10">
          <FlexContainer variant="column-start" className="mt-5" gap="xl">
            <h3 className="text-2xl font-medium">Comments</h3>
            <div className="rounded-lg bg-gray-50 p-6 text-center dark:bg-gray-800">
              <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
                💬 Comments Coming Soon!
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                We&apos;re working on bringing you an enhanced commenting
                experience. Stay tuned!
              </p>
            </div>
          </FlexContainer>
        </section>

        {/* Social Sharing Modal */}
        <Modal
          isOpen={isOpen}
          size="xl"
          backdrop="blur"
          onOpenChange={onOpenChange}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Share this article
                </ModalHeader>
                <ModalBody>
                  <FlexContainer variant="row-between" wrap="wrap" gap="sm">
                    <Link
                      href={`https://www.facebook.com/sharer/sharer.php?u=${process.env.NEXT_PUBLIC_BASE_URL}${router.asPath}`}
                      target="_blank"
                    >
                      <FacebookIcon size={50} round />
                    </Link>
                    <Link
                      target="_blank"
                      href={`https://twitter.com/intent/tweet?url=${process.env.NEXT_PUBLIC_BASE_URL}${router.asPath}&text=${props.data.fields.title}`}
                    >
                      {" "}
                      <TwitterIcon size={50} round />
                    </Link>
                    <Link
                      target="_blank"
                      href={`https://www.linkedin.com/shareArticle?mini=true&url=${process.env.NEXT_PUBLIC_BASE_URL}${router.asPath}&title=${props.data.fields.title}&summary=${props.data.fields.description}`}
                    >
                      <LinkedinIcon size={50} round />
                    </Link>
                    <Link
                      target="_blank"
                      //pinterest
                      href={`https://pinterest.com/pin/create/button/?url=${process.env.NEXT_PUBLIC_BASE_URL}${router.asPath}&media=${thumbnail}&description=${props.data.fields.title}`}
                    >
                      <PinterestIcon size={50} round />
                    </Link>
                    <Link
                      //telegram
                      target="_blank"
                      href={`https://t.me/share/url?url=${process.env.NEXT_PUBLIC_BASE_URL}${router.asPath}&text=${props.data.fields.title}`}
                    >
                      <TelegramIcon size={50} round />
                    </Link>
                    <Link
                      target="_blank"
                      //whasapp
                      href={`https://api.whatsapp.com/send?text=${props.data.fields.title} ${process.env.NEXT_PUBLIC_BASE_URL}${router.asPath}`}
                    >
                      {" "}
                      <WhatsappIcon size={50} round />
                    </Link>
                    <Link
                      //mail
                      target="_blank"
                      href={`mailto:?subject=${props.data.fields.title}&body=${props.data.fields.description} "${process.env.NEXT_PUBLIC_BASE_URL}${router.asPath}"`}
                    >
                      <EmailIcon size={50} round />
                    </Link>
                  </FlexContainer>
                </ModalBody>
                <ModalFooter></ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </FlexContainer>
    </main>
  );
};

export const getStaticPaths = async () => {
  try {
    // Only pre-build the most recent/popular articles
    const articles = await client.getEntries({
      content_type: "blogPage",
      select: ["fields.slug"],
      limit: 50, // Pre-build only 50 most recent articles
      order: ["-sys.createdAt"],
    });

    const paths = articles.items.map((item) => ({
      params: { slug: item.fields.slug },
    }));

    return {
      paths,
      fallback: "blocking", // Generate other articles on-demand
    };
  } catch (error) {
    console.error("Error in getStaticPaths:", error);
    return {
      paths: [],
      fallback: "blocking",
    };
  }
};
export const getStaticProps = async (
  ctx: { params: { slug: string } } & GetStaticProps,
) => {
  try {
    const { slug } = ctx.params || {};

    if (!slug) {
      return { notFound: true };
    }

    const articles = await client
      .getEntries({
        content_type: "blogPage",
        "fields.slug": slug,
        include: 1,
        select: ["fields", "sys.id"],
      })
      .catch((error) => {
        console.error("Failed to fetch article:", error);
        return { items: [] };
      });

    // Handle case when article is not found
    if (!articles.items || articles.items.length === 0) {
      return { notFound: true };
    }

    const mainArticle = articles.items[0] as any;
    // console.log("Main Article:", mainArticle);

    // Safely extract recommended posts IDs with fallbacks
    const recommendedArticlesIds = Array.isArray(
      mainArticle?.fields?.recommendedPosts,
    )
      ? mainArticle.fields.recommendedPosts
          .filter((post: { sys: { id: any } }) => post?.sys?.id)
          .map((post: any) => post?.sys?.id)
      : [];

    // Fetch recommended articles with error handling
    const recommendedArticles = await client
      .getEntries({
        content_type: "blogPage",
        "sys.id[in]":
          recommendedArticlesIds.length > 0 ? recommendedArticlesIds : [""],
        include: 3,
      })
      .catch((error) => {
        // console.error("Failed to fetch recommended articles:", error);
        return { items: [] };
      });

    let safeRecommendedArticles = [];
    let safeJsonArticle = null;

    try {
      if (
        recommendedArticles.items &&
        Array.isArray(recommendedArticles.items)
      ) {
        safeRecommendedArticles = recommendedArticles.items
          .map((item) => {
            try {
              // Process each item individually
              return JSON.parse(safeJsonStringify(item));
            } catch (itemError) {
              // console.error(
              //   "Error stringifying recommended article item:",
              //   itemError,
              // );
              // Return a minimal representation if full item can't be stringified
              return item.sys && item.fields
                ? {
                    sys: { id: item.sys.id },
                    fields: {
                      title: item.fields.title,
                      slug: item.fields.slug,
                      image: item.fields.image,
                    },
                  }
                : {};
            }
          })
          .filter(Boolean); // Remove any null/undefined items
      }

      // Handle main article
      if (mainArticle) {
        try {
          safeJsonArticle = JSON.parse(safeJsonStringify(mainArticle));
        } catch (mainArticleError) {
          // console.error("Error stringifying main article:", mainArticleError);

          // Fall back to a minimal representation with essential fields
          if (mainArticle.sys && mainArticle.fields) {
            safeJsonArticle = {
              sys: { id: mainArticle.sys.id },
              fields: {
                title: mainArticle.fields.title,
                slug: mainArticle.fields.slug,
                image: mainArticle.fields.image,
                body: mainArticle.fields.body,
                category: mainArticle.fields.category,
                authors: mainArticle.fields.authors,
                date: mainArticle.fields.date,
                description: mainArticle.fields.description,
              },
            };
          }
        }
      }
    } catch (error) {
      console.log("Error in overall stringification process:", error);
    }

    return {
      props: {
        data: safeJsonArticle || {},
        recommendedArticles: safeRecommendedArticles || [],
      },
      // Revalidate the page every hour
      revalidate: 3600,
    };
  } catch (error) {
    console.log("Error in getStaticProps:", error);
    return { notFound: true };
  }
};

export default Index;
