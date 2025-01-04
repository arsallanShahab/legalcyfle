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
import { useGlobalContext } from "@/context/GlobalContext";
import client from "@/lib/contentful";
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
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import dayjs from "dayjs";
import tz from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import {
  Ban,
  Heart,
  Loader,
  Share,
  ThumbsDown,
  ThumbsUp,
  Trash,
} from "lucide-react";
import { GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import NiceAvatar, { genConfig } from "react-nice-avatar";
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
};

const Index = (props: Props) => {
  const router = useRouter();
  const { user } = useGlobalContext();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [article, setArticle] = React.useState<IArticle | null>(null);

  // loading states
  const [likeLoading, setLikeLoading] = React.useState<boolean>(false);
  const [dislikeLoading, setDislikeLoading] = React.useState<boolean>(false);
  const [heartLoading, setHeartLoading] = React.useState<boolean>(false);
  const [commentLoading, setCommentLoading] = React.useState<boolean>(false);
  const [commentDeleting, setCommentDeleting] = React.useState<boolean>(false);

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

  const [comment, setComment] = React.useState<string>("");
  const [comments, setComments] = React.useState<Comment[]>([]);

  const { getData, loading, data, error, refresh } = useGet<
    ApiResponse<MetricsResponse>
  >({ showToast: false });

  const handleHeart = async () => {
    if (!user?._id) {
      return toast.error("Please login to heart this article");
    }
    try {
      setHeartLoading(true);
      const res = await fetch(`/api/articles/${props.data.fields.slug}/heart`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = (await res.json()) as ApiResponse<HeartResponse>;
      if (data.success) {
        setIsHearted(data.data?.isHearted);
        setHeartCount(data.data?.hearts);
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
    if (!user?._id) {
      return toast.error("Please login to like this article");
    }
    try {
      setLikeLoading(true);
      const res = await fetch(`/api/articles/${props.data.fields.slug}/like`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = (await res.json()) as ApiResponse<LikeResponse>;
      console.log(data, "data");
      if (data.success) {
        setIsLiked(data.data?.isLiked);
        setLikeCount(data.data?.likes);
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
    if (!user?._id) {
      return toast.error("Please login to dislike this article");
    }
    try {
      setDislikeLoading(true);
      const res = await fetch(
        `/api/articles/${props.data.fields.slug}/dislike`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const data = (await res.json()) as ApiResponse<DislikeResponse>;
      if (data.success) {
        setIsDisliked(data.data?.isDisliked);
        setDislikeCount(data.data?.dislikes);
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

  const handleAddComment = async () => {
    if (!user?._id) {
      return toast.error("Please login to comment on this article");
    }
    if (!comment) {
      return toast.error("Please write a comment before posting");
    }
    if (!article?._id) {
      return toast.error("Please reload the page and try again");
    }
    try {
      setCommentLoading(true);
      const res = await fetch(
        `/api/articles/${props.data.fields.slug}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: comment,
            articleId: article._id,
          }),
        },
      );
      const data = (await res.json()) as ApiResponse<LikeResponse>;
      setComment("");
      if (data.success) {
        refresh(props.data.fields.slug);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const err = error as Error & { message: string };
      toast.error(err.message);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user?._id) {
      return toast.error("Please login to delete this comment");
    }
    try {
      setCommentDeleting(true);
      const res = await fetch(
        `/api/articles/${props.data.fields.slug}/comment`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            commentId,
          }),
        },
      );
      const data = (await res.json()) as ApiResponse<{}>;
      if (data.success) {
        refresh(props.data.fields.slug);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const err = error as Error & { message: string };
      toast.error(err.message);
    } finally {
      setCommentDeleting(false);
    }
  };

  const thumbnail =
    props.data?.fields?.image?.fields?.file?.url ||
    "https://picsum.photos/500/500";

  useEffect(() => {
    getData(
      `/api/articles/${props.data.fields.slug}/metrics`,
      props.data.fields.slug,
      {
        loading: "Loading metrics...",
        success: "Metrics loaded successfully",
        failure: "Failed to load metrics",
      },
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data]);

  useEffect(() => {
    if (data?.data) {
      setArticle(data?.data?.article);
      setComments(data?.data?.comments);
      setLikeCount(data?.data?.like);
      setDislikeCount(data?.data?.dislikes);
      setHeartCount(data?.data?.hearts);
      setIsLiked(data?.data?.isLiked);
      setIsDisliked(data?.data?.isDisliked);
      setIsHearted(data?.data?.isHearted);
    }
  }, [data]);

  // const structuredData = {
  //   "@context": "https://schema.org",
  //   "@type": "BlogPosting",
  //   headline: props.data.fields.title,
  //   image: formatImageLink(thumbnail),
  //   author: props.data.fields.authors.map((author) => ({
  //     "@type": "Person",
  //     name: author.fields.name,
  //     url: `/author/${author.sys.id}`,
  //   })),
  //   datePublished: props.data.fields.date,
  //   dateModified: props.data.fields.date,
  //   description: excerpt(props.data.fields.title, 160),
  //   mainEntityOfPage: {
  //     "@type": "WebPage",
  //     "@id": `https://legalcyfle.in/${props.data.fields.slug}`,
  //   },
  // };

  const keywords = generateKeywords(
    props.data.fields.category.map((cat) => cat.fields.name),
    props.data.fields.title,
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
              `https://legalcyfle.in/${props.data.fields.slug}/#respond`,
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
        <title>{props.data.fields.title} - LegalCyfle</title>
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
        className="mx-auto max-w-3xl px-4 py-10 md:px-10 md:py-20"
        gap="2xl"
      >
        <AdWrapper
          data-ad-format="fluid"
          data-ad-layout="in-article"
          data-ad-slot="5250825277"
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
          <h1 className="max-w-xl text-left font-poppins text-3xl font-semibold md:text-4xl">
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
                    <Heart className="h-4 w-4 fill-white text-white" />{" "}
                    {heartCount}
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
                    <ThumbsUp className="h-4 w-4 fill-white text-white" />{" "}
                    {likeCount}
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
                  <ThumbsDown className="h-4 w-4 fill-white text-white" />{" "}
                  {dislikeCount}
                </span>
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
          className="h-auto w-full rounded-xl border object-cover object-center"
          alt="Cover"
        />
        <BlogContent data={props.data} />
        <span className="block pl-2 pt-2 text-sm font-medium">TAGS:</span>
        <FlexContainer
          variant="column-start"
          gap="sm"
          className="mb-2.5 rounded-xl bg-zinc-100 p-2"
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
                    variant={"default"}
                    className="rounded-3xl px-4 py-1.5 text-sm"
                  >
                    {category.fields.name}
                  </Badge>
                </Link>
              ))}
            </FlexContainer>
            <Button className="rounded-3xl" onClick={onOpen}>
              <Share className="h-3.5 w-3.5 stroke-2 text-white dark:text-black" />
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
            <p className="max-w-lg text-base font-normal text-gray-400">
              {props.data.fields.authors[0]?.fields?.bio}
            </p>
          )}
        </FlexContainer>
        <FlexContainer variant="column-start" className="mt-5" gap="xl">
          <h3 className="text-2xl font-medium">Comments</h3>
          {comments.length === 0 && (
            <p className="text-lg font-normal text-gray-500">
              No comments yet. Be the first to comment on this article.
            </p>
          )}
          {!user && (
            <Link href={`/login?redirect=${router.asPath}`}>
              <Button className="rounded-3xl px-7">Login to comment</Button>
            </Link>
          )}
          {user && (
            <FlexContainer>
              <NiceAvatar
                {...genConfig(user.firstName)}
                className="h-10 w-10"
              />
              <FlexContainer variant="column-end" gap="md" className="w-full">
                <Textarea
                  value={comment}
                  onValueChange={setComment}
                  placeholder="Write your comment here"
                  // disabled={
                  //   comments.some((c) => c.author._id === user._id) ||
                  //   !user?._id
                  // }
                />
                <Button
                  className="rounded-3xl px-7"
                  onClick={handleAddComment}
                  loading={commentLoading}
                >
                  save
                </Button>
              </FlexContainer>
            </FlexContainer>
          )}
          {comments.map((comment) => (
            <FlexContainer key={comment._id} className="mt-5">
              <NiceAvatar
                {...genConfig(comment.author.firstName)}
                className="h-10 w-10"
              />
              <FlexContainer variant="column-end" className="w-full">
                <FlexContainer
                  gap="none"
                  className="relative flex w-full flex-col items-start justify-start rounded-xl bg-zinc-100 p-3 dark:bg-zinc-800"
                >
                  <p className="text-lg font-semibold">
                    {comment.author.firstName}
                  </p>
                  <p className="text-base font-normal text-gray-700 dark:text-gray-200">
                    {comment.content}
                  </p>
                  {comment.author._id === user?._id && (
                    <Button
                      size={"icon"}
                      variant={"destructive"}
                      onClick={() => handleDeleteComment(comment._id!)}
                      className="absolute -right-2 -top-2 rounded-3xl"
                    >
                      {commentDeleting ? (
                        <Loader className="h-4 w-4 animate-spin text-white" />
                      ) : (
                        <Trash className="h-4 w-4 fill-white text-white" />
                      )}
                    </Button>
                  )}
                </FlexContainer>
                <span className="text-sm text-gray-700">
                  {dayjs(comment.createdAt).format("hh:mm A - MMMM DD, YYYY")}
                </span>
              </FlexContainer>
            </FlexContainer>
          ))}
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
  const articles = await client.getEntries({
    content_type: "blogPage",
  });
  const paths = articles.items.map((item) => ({
    params: { slug: item.fields.slug },
  }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (
  ctx: { params: { slug: string } } & GetStaticProps,
) => {
  const { slug } = ctx.params;
  const articles = await client.getEntries({
    content_type: "blogPage",
    "fields.slug": slug,
  });

  const safeJsonArticle = JSON.parse(safeJsonStringify(articles.items[0]));
  // console.log(articles.items, "articles");
  return {
    props: {
      data: safeJsonArticle,
    },
  };
};

export default Index;
