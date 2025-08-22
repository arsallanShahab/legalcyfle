import AdWrapper from "@/components/AdWrapper";
import BlogContent from "@/components/Blog";
import FlexContainer from "@/components/FlexContainer";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import client from "@/lib/contentful";
import {
  checkDevicePreference,
  getDeviceId,
  updateDevicePreferences,
} from "@/lib/device-id";
import useGet from "@/lib/hooks/use-get";
import {
  estimateReadingTime,
  excerpt,
  formatImageLink,
  generateKeywords,
  sanitizeString,
} from "@/lib/utils";
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
  Avatar,
  AvatarGroup,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import dayjs from "dayjs";
import tz from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import {
  Ban,
  Eye,
  Heart,
  Loader,
  Share,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, useEffect } from "react";
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

const DynamicAdWrapper = dynamic(() => import("../../components/DynamicAd"), {
  ssr: false,
  loading: () => (
    <div style={{ width: "100%", minWidth: "250px", height: "100px" }} />
  ),
});

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
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data, deviceId]);

  console.log("Category: ", props.data.fields?.category);

  const keywords = generateKeywords(
    props.data.fields?.category?.map((cat) => cat.fields.name),
    props.data.fields?.title,
    props.data.fields?.description ?? "",
  );

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `https://legalcyfle.in/${props.data.fields.slug}/#article`,
        isPartOf: { "@id": `https://legalcyfle.in/${props.data.fields.slug}/` },
        author: props.data.fields.authors.map((author) => ({
          "@id": `https://legalcyfle.in/#/schema/person/image/${author.sys.id}`,
          "@type": "Person",
          name: author.fields.name,
          url: `https://legalcyfle.in/author/${author.sys.id}/`,
          image: {
            "@type": "ImageObject",
            inLanguage: "en-US",
            "@id": `https://legalcyfle.in/#/schema/person/image/${author.sys.id}`,
            url: formatImageLink(author?.fields?.avatar?.fields?.file?.url),
            contentUrl: formatImageLink(
              author?.fields?.avatar?.fields?.file?.url,
            ),
            caption: author.fields.name,
          },
          sameAs: [], // Add social links if available
          description: author?.fields?.bio,
        })),
        headline: props.data.fields.title,
        datePublished: props.data.fields.date,
        dateModified: props.data.sys.updatedAt,
        mainEntityOfPage: {
          "@id": `https://legalcyfle.in/${props.data.fields.slug}/`,
        },
        wordCount: props.data?.fields?.body?.content?.reduce(
          (count, node) =>
            count +
            node.content.reduce(
              (innerCount, innerNode) =>
                innerCount +
                (innerNode.value ? innerNode.value.split(" ").length : 0),
              0,
            ),
          0,
        ),
        commentCount: comments.length, // Update with actual comment count if available
        publisher: { "@id": "https://legalcyfle.in/#organization" },
        image: {
          "@id": `https://legalcyfle.in/${props.data.fields.slug}/#primaryimage`,
        },
        thumbnailUrl: formatImageLink(props.data.fields.image.fields.file.url),
        keywords: keywords,
        articleSection: props.data.fields.category.map(
          (cat) => cat.fields.name,
        ),
        inLanguage: "en-US",
        potentialAction: [
          {
            "@type": "CommentAction",
            name: "Comment",
            target: [
              `https://legalcyfle.in/${props.data.fields.slug}/#comment`,
            ],
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": `https://legalcyfle.in/${props.data.fields.slug}/`,
        url: `https://legalcyfle.in/${props.data.fields.slug}/`,
        name: `${props.data.fields.title} - LegalCyfle`,
        isPartOf: { "@id": "https://legalcyfle.in/#website" },
        primaryImageOfPage: {
          "@id": `https://legalcyfle.in/${props.data.fields.slug}/#primaryimage`,
        },
        image: {
          "@id": `https://legalcyfle.in/${props.data.fields.slug}/#primaryimage`,
        },
        thumbnailUrl: formatImageLink(props.data.fields.image.fields.file.url),
        datePublished: props.data.fields.date,
        dateModified: props.data.sys.updatedAt,
        breadcrumb: {
          "@id": `https://legalcyfle.in/${props.data.fields.slug}/#breadcrumb`,
        },
        inLanguage: "en-US",
        potentialAction: [
          {
            "@type": "ReadAction",
            target: [`https://legalcyfle.in/${props.data.fields.slug}/`],
          },
        ],
      },
      {
        "@type": "ImageObject",
        inLanguage: "en-US",
        "@id": `https://legalcyfle.in/${props.data.fields.slug}/#primaryimage`,
        url: formatImageLink(props?.data?.fields?.image?.fields?.file?.url),
        contentUrl: formatImageLink(
          props?.data?.fields?.image?.fields?.file?.url,
        ),
        width: props.data?.fields?.image?.fields?.file?.details?.image?.width,
        height: props.data?.fields?.image?.fields?.file?.details?.image?.height,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `https://legalcyfle.in/${props.data.fields.slug}/#breadcrumb`,
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
            name: props.data.fields.category[0]?.fields?.name,
            item: `https://legalcyfle.in/category/${props.data.fields.category[0]?.fields?.slug}`,
          },
          { "@type": "ListItem", position: 3, name: props.data.fields.title },
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
        image: { "@id": "https://legalcyfle.in/#/schema/logo/image/" },
        sameAs: [
          "https://www.facebook.com/profile.php?id=61559661011805",
          "https://www.linkedin.com/company/legalcyfle-in/",
          "https://www.instagram.com/legalcyfle/?hl=en",
        ],
      },
    ],
  };

  return (
    <main className="relative">
      <Head>
        <title>{`${props.data.fields.title ?? "Home"} - LegalCyfle`}</title>
        <meta name="description" content={props.data.fields.description} />
        <meta name="keywords" content={keywords} />
        <link
          rel="canonical"
          href={`https://legalcyfle.in/${props.data.fields.slug}`}
        />
        <meta property="og:title" content={props.data.fields.title} />
        <meta
          property="og:description"
          content={props.data.fields.description}
        />
        <meta property="og:image" content={formatImageLink(thumbnail)} />
        <meta
          property="og:url"
          content={`https://legalcyfle.in/${props.data.fields.slug}`}
        />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={props.data.fields.title} />
        <meta
          name="twitter:description"
          content={props.data.fields.description}
        />
        <meta name="twitter:image" content={formatImageLink(thumbnail)} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <FlexContainer
        variant="column-start"
        className="mx-auto max-w-4xl px-4 py-10 pt-2.5 md:px-10 md:py-20 md:pt-2.5"
        gap="2xl"
      >
        {/* <AdWrapper
          data-ad-slot="4210005765"
          data-ad-format="auto"
          data-full-width-responsive="true"
        /> */}
        {/* <DynamicAdWrapper
          slot="1973122915"
          format="fluid"
          layoutKey="-et-7n+gx+cc-19b"
        /> */}
        <AdWrapper
          data-ad-format="fluid"
          data-ad-layout-key="-et-7n+gx+cc-19b"
          data-ad-slot="1973122915"
        />
        <FlexContainer variant="column-start" gap="md">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  className="font-giest-sans font-normal"
                  href="/"
                >
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  className="font-giest-sans font-normal"
                  href={
                    "/category/" + props.data.fields.category[0]?.fields?.slug
                  }
                >
                  {props.data.fields.category[0]?.fields?.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-giest-sans font-medium text-amber-600">
                  {excerpt(props.data.fields.title, 50)}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="max-w-3xl text-left font-poppins text-3xl font-semibold md:text-5xl">
            {props.data.fields.title}
          </h1>
        </FlexContainer>
        <FlexContainer variant="row-start" alignItems="center">
          {props.data.fields?.authors?.length > 1 && (
            <AvatarGroup isBordered>
              {props.data.fields?.authors.map((author) => (
                <Tooltip
                  showArrow
                  placement="right"
                  classNames={{
                    base: [
                      // arrow color
                      "before:bg-neutral-400 dark:before:bg-white",
                    ],
                    content: [
                      "py-2 px-4 shadow-xl text-nowrap break-keep text-center w-auto",
                      "text-black bg-gradient-to-br from-white to-neutral-400",
                    ],
                  }}
                  key={author.sys.id}
                  content={author.fields.name}
                >
                  <Avatar
                    src={formatImageLink(
                      author?.fields?.avatar?.fields?.file?.url ??
                        "https://via.placeholder.com/100x100",
                    )}
                    // size="md"
                    className="h-12 w-12 rounded-[80px] object-cover object-center"
                    alt={author.fields.name}
                  />
                </Tooltip>
              ))}
            </AvatarGroup>
          )}

          {props.data.fields?.authors?.length === 1 && (
            <Image
              src={formatImageLink(
                props?.data?.fields?.authors[0]?.fields?.avatar?.fields?.file
                  ?.url ?? "https://via.placeholder.com/100x100",
              )}
              width={100}
              height={100}
              className="h-12 w-12 rounded-[80px] object-cover object-center"
              alt="Profile"
            />
          )}
          <FlexContainer variant="column-start" alignItems="center" gap="none">
            <p className="flex gap-2.5 text-sm font-semibold">
              {props.data.fields.authors.map((author, index) => (
                <Link
                  key={author.sys.id}
                  href={`/author/${author.sys.id}`}
                  className="hover:underline"
                >
                  {author.fields.name}{" "}
                  {index < props.data.fields.authors.length - 1 && ","}
                </Link>
              ))}
            </p>
            {/* <Link
            href={`/author/${props.data.fields?.author?.sys?.id}`}
            className="text-base font-semibold hover:underline"
          >
            {props.data.fields.author.fields.name}
          </Link> */}
            <p className="text-sm font-medium text-gray-500">
              {estimateReadingTime(
                documentToHtmlString(props.data.fields.body as Document),
              )}{" "}
              min read •{" "}
              {props?.data?.fields?.date
                ? dayjs(props?.data?.fields?.date)
                    .tz("Asia/Kolkata")
                    .format("MMMM DD, YYYY")
                : "Date not available"}
            </p>
          </FlexContainer>
        </FlexContainer>
        <FlexContainer
          variant="row-between"
          // className="border-y border-zinc-100 py-5"
        >
          <FlexContainer gap="sm">
            {/* loading skeleton */}
            {loading ? (
              <Button
                disabled
                className="rounded-3xl bg-pink-600 dark:bg-pink-600"
              >
                <Loader className="h-4 w-4 animate-spin" />
              </Button>
            ) : (
              <Button
                onClick={handleHeart}
                disabled={loading || heartLoading || isLiked || isDisliked}
                loading={heartLoading}
                className="gap-2 rounded-3xl bg-pink-600 hover:bg-pink-500 dark:bg-pink-600 dark:text-white dark:hover:bg-pink-500"
              >
                {error ? (
                  <Ban className="h-4 w-4 text-white" />
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Heart className="h-4 w-4 text-white" /> {heartCount}
                  </span>
                )}
              </Button>
            )}
            {loading ? (
              <Button
                disabled
                className="rounded-3xl bg-blue-600 dark:bg-blue-600"
              >
                <Loader className="h-4 w-4 animate-spin" />
              </Button>
            ) : (
              <Button
                onClick={handleLike}
                disabled={loading || likeLoading || isHearted || isDisliked}
                loading={likeLoading}
                className="gap-2 rounded-3xl bg-blue-600 hover:bg-blue-500 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"
              >
                {error ? (
                  <Ban className="h-4 w-4 text-white" />
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <ThumbsUp className="h-4 w-4 text-white" /> {likeCount}
                  </span>
                )}
              </Button>
            )}
            {loading ? (
              <Button
                disabled
                className="rounded-3xl bg-red-600 dark:bg-red-600"
              >
                <Loader className="h-4 w-4 animate-spin" />
              </Button>
            ) : (
              <Button
                onClick={handleDislike}
                disabled={loading || dislikeLoading || isHearted || isLiked}
                loading={dislikeLoading}
                className="gap-2 rounded-3xl bg-red-600 hover:bg-red-500 dark:bg-red-600 dark:text-white dark:hover:bg-red-500"
              >
                <span className="flex items-center justify-center gap-2">
                  <ThumbsDown className="h-4 w-4 text-white" /> {dislikeCount}
                </span>
              </Button>
            )}

            {loading ? (
              <Button className="rounded-3xl" disabled>
                {" "}
                <Loader className="h-4 w-4 animate-spin" />
              </Button>
            ) : (
              <Button disabled={loading} className="gap-2 rounded-3xl">
                {article?.views}
                <Eye className="h-4 w-4 text-white dark:text-black" />
              </Button>
            )}
          </FlexContainer>
          <Button className="rounded-3xl" onClick={onOpen}>
            <Share className="h-3.5 w-3.5 stroke-2 text-white dark:text-black" />
          </Button>
        </FlexContainer>
        <Image
          src={formatImageLink(thumbnail)}
          width={1280}
          height={720}
          onClick={() => {
            window.open(formatImageLink(thumbnail), "_blank");
          }}
          className="h-[400px] w-full rounded-xl border object-cover object-top"
          alt="Cover"
        />
        <BlogContent data={props.data} />
        <span className="block pl-2 pt-2 text-sm font-medium">TAGS:</span>
        <FlexContainer
          variant="column-start"
          gap="sm"
          className="mb-2.5 rounded-3xl bg-zinc-50 p-2 dark:bg-zinc-700"
        >
          <FlexContainer variant="row-between">
            <FlexContainer variant="row-start" gap="sm" alignItems="center">
              {props.data.fields.category.map((category) => (
                <Link
                  key={category.sys.id}
                  href={`/category/${category.fields.slug}`}
                >
                  <Badge
                    key={category.sys.id}
                    variant={"secondary"}
                    className="borderpx-4 rounded-3xl py-1.5 text-sm"
                  >
                    {category.fields.name}
                  </Badge>
                </Link>
              ))}
            </FlexContainer>
            <Button
              variant={"secondary"}
              className="rounded-3xl"
              onClick={onOpen}
            >
              <Share className="h-3.5 w-3.5 stroke-2 text-black dark:text-white" />
            </Button>
          </FlexContainer>
        </FlexContainer>

        <FlexContainer variant="column-start" className="mt-5">
          <FlexContainer variant="row-start" gap="sm">
            {props.data.fields?.authors?.length > 1 && (
              <AvatarGroup isBordered>
                {props.data.fields?.authors.map((author) => (
                  <Tooltip
                    showArrow
                    placement="right"
                    classNames={{
                      base: [
                        // arrow color
                        "before:bg-neutral-400 dark:before:bg-white",
                      ],
                      content: [
                        "py-2 px-4 shadow-xl text-nowrap break-keep text-center w-auto",
                        "text-black bg-gradient-to-br from-white to-neutral-400",
                      ],
                    }}
                    key={author.sys.id}
                    content={author.fields.name}
                  >
                    <Avatar
                      src={formatImageLink(
                        author?.fields?.avatar?.fields?.file?.url ??
                          "https://via.placeholder.com/100x100",
                      )}
                      // size="md"
                      className="h-20 w-20 rounded-[80px] object-cover object-center"
                      alt={author.fields.name}
                    />
                  </Tooltip>
                ))}
              </AvatarGroup>
            )}{" "}
            {props.data.fields?.authors?.length === 1 && (
              <Image
                src={formatImageLink(
                  props?.data?.fields?.authors[0]?.fields?.avatar?.fields?.file
                    ?.url ?? "https://via.placeholder.com/100x100",
                )}
                width={100}
                height={100}
                className="h-20 w-20 rounded-[80px] object-cover object-center"
                alt="Profile"
              />
            )}
          </FlexContainer>
          <FlexContainer variant="row-between" alignItems="center">
            <h3 className="text-2xl font-medium">
              Written By{" "}
              {props.data.fields?.authors
                .map((author) => author.fields.name)
                .join(", ")}
            </h3>
            {/* <Button className="rounded-3xl bg-blue-600 hover:bg-blue-500 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500">
            Follow
          </Button> */}
          </FlexContainer>
          {props.data.fields?.authors.length === 1 && (
            <p className="max-w-2xl text-base font-normal text-gray-400">
              {props.data.fields.authors[0]?.fields?.bio}
            </p>
          )}
        </FlexContainer>
        {props.recommendedArticles.length > 0 && (
          <FlexContainer variant="column-start" className="mt-5" gap="xl">
            <h3 className="text-2xl font-medium">Recommended Articles</h3>
            <div className="grid items-stretch gap-5 md:grid-cols-2">
              {props.recommendedArticles?.map((article) => {
                return (
                  <a key={article.sys.id} href={`/${article.fields.slug}`}>
                    <FlexContainer
                      variant="column-start"
                      className="h-full rounded-3xl bg-zinc-50 p-3 dark:bg-zinc-700"
                    >
                      <Image
                        src={formatImageLink(
                          article.fields.image.fields.file.url,
                        )}
                        width={300}
                        height={200}
                        className="h-40 w-full rounded-xl object-cover object-center"
                        alt="Cover"
                      />
                      <h3 className="text-lg font-semibold">
                        {article.fields.title}
                      </h3>
                    </FlexContainer>
                  </a>
                );
              })}
            </div>
          </FlexContainer>
        )}
        <FlexContainer
          id="comment"
          variant="column-start"
          className="mt-5"
          gap="xl"
        >
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

    // Safely stringify with error handling
    let safeRecommendedArticles = [];
    let safeJsonArticle = null;

    try {
      // Handle recommended articles - process one by one to avoid size issues
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
