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
import { Heart, Share, ThumbsDown, ThumbsUp } from "lucide-react";
import { GetStaticProps } from "next";
import Image from "next/image";
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

type Props = {
  data: BlogEntry;
};

const Index = (props: Props) => {
  const router = useRouter();
  const { user } = useGlobalContext();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  //
  const [likeLoading, setLikeLoading] = React.useState<boolean>(false);
  const [dislikeLoading, setDislikeLoading] = React.useState<boolean>(false);
  const [heartLoading, setHeartLoading] = React.useState<boolean>(false);

  //
  const [isLiked, setIsLiked] = React.useState<boolean | undefined>(false);
  const [isDisliked, setIsDisliked] = React.useState<boolean | undefined>(
    false,
  );
  const [isHearted, setIsHearted] = React.useState<boolean | undefined>(false);

  //
  const [likeCount, setLikeCount] = React.useState<number | undefined>(0);
  const [dislikeCount, setDislikeCount] = React.useState<number | undefined>(0);
  const [heartCount, setHeartCount] = React.useState<number | undefined>(0);

  const { getData, loading, data, error } =
    useGet<ApiResponse<MetricsResponse>>();

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

  console.log(props.data);

  const thumbnail =
    props.data?.fields?.image?.fields?.file?.url ||
    "https://picsum.photos/500/500";

  useEffect(() => {
    getData({
      url: `/api/articles/${props.data.fields.slug}/metrics`,
      options: {
        showToast: true,
        messages: {
          loading: "Loading metrics...",
          success: "Metrics loaded successfully",
          failure: "Failed to load metrics",
        },
      },
      tag: props.data.fields.slug,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data]);

  useEffect(() => {
    if (data?.data) {
      setLikeCount(data?.data?.like);
      setDislikeCount(data?.data?.dislikes);
      setHeartCount(data?.data?.hearts);
    }
  }, [data]);

  return (
    <FlexContainer
      variant="column-start"
      className="mx-auto max-w-3xl px-5 py-10 md:px-10 md:py-20"
      gap="5xl"
    >
      <FlexContainer variant="column-start" gap="md">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink className="font-giest-sans font-normal" href="/">
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
            {dayjs(props.data.fields?.date).format(" hh:mm A - MMMM DD, YYYY")}
          </p>
        </FlexContainer>
      </FlexContainer>
      <FlexContainer
        variant="row-between"
        // className="border-y border-zinc-100 py-5"
      >
        <FlexContainer gap="sm">
          <Button
            onClick={handleHeart}
            disabled={loading || heartLoading}
            loading={heartLoading}
            className="gap-2 rounded-3xl bg-pink-600 hover:bg-pink-500 dark:bg-pink-600 dark:text-white dark:hover:bg-pink-500"
          >
            <Heart className="h-4 w-4 fill-white text-white" /> {heartCount}
          </Button>
          <Button
            onClick={handleLike}
            disabled={loading || likeLoading}
            loading={likeLoading}
            className="gap-2 rounded-3xl bg-blue-600 hover:bg-blue-500 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"
          >
            <ThumbsUp className="h-4 w-4 fill-white text-white" /> {likeCount}
          </Button>
          <Button
            onClick={handleDislike}
            disabled={loading || dislikeLoading}
            loading={dislikeLoading}
            className="gap-2 rounded-3xl bg-red-600 hover:bg-red-500 dark:bg-red-600 dark:text-white dark:hover:bg-red-500"
          >
            <ThumbsDown className="h-4 w-4 fill-white text-white" />{" "}
            {dislikeCount}
          </Button>
        </FlexContainer>
        <Button className="rounded-3xl" onClick={onOpen}>
          <Share className="h-3.5 w-3.5 stroke-2 text-white dark:text-black" />
        </Button>
      </FlexContainer>
      <Image
        src={formatImageLink(thumbnail)}
        width={1280}
        height={720}
        className="h-auto max-h-80 w-full rounded-xl border object-cover object-center"
        alt="Cover"
      />
      <BlogContent data={props.data} />
      <FlexContainer variant="row-start" gap="sm" className="mb-2.5">
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
            {props.data.fields.author.fields.bio}
          </p>
        )}
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
  );
};

export const getStaticPaths = async () => {
  const articles = await client.getEntries({
    content_type: "blogPage",
  });
  const paths = articles.items.map((item) => ({
    params: { slug: item.fields.slug },
  }));
  console.log(paths, "paths");
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (
  ctx: { params: { slug: string } } & GetStaticProps,
) => {
  const { slug } = ctx.params;
  console.log(slug, "slug");
  const articles = await client.getEntries({
    content_type: "blogPage",
    "fields.slug": slug,
  });
  // console.log(articles.items, "articles");
  return {
    props: {
      data: articles.items[0],
    },
  };
};

export default Index;
