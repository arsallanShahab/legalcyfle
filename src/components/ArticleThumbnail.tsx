import { cn } from "@/lib/utils";
import { Divider } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import FlexContainer from "./FlexContainer";

type Props = {
  title: string;
  date: string;
  author: string;
  readTime: number;
  image: string;
  alt: string;
  link: string;
  isLarge?: boolean;
  className?: string;
};

const ArticleThumbnail: FC<Props> = ({
  title,
  date,
  alt,
  author,
  image,
  link,
  readTime,
  isLarge = false,
  className,
}) => {
  return (
    <Link
      href={""}
      className={cn("group relative overflow-hidden rounded-xl", className)}
    >
      <Image
        src={image}
        alt={alt}
        width={1280}
        height={720}
        className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
      />
      <FlexContainer
        variant="column-start"
        gap="sm"
        className="to absolute inset-x-0 bottom-0 bg-gradient-to-t from-amber-600 to-transparent p-5 pt-10"
      >
        <p
          className={cn(
            "inline-block text-lg font-medium text-white",
            isLarge && "text-3xl",
          )}
        >
          {title}
        </p>
        <FlexContainer variant="row-between" alignItems="center">
          <FlexContainer alignItems="center">
            <p
              className={cn(
                "text-sm font-medium text-white",
                isLarge && "text-medium",
              )}
            >
              {date}
            </p>
            <Divider
              orientation="vertical"
              className="h-4 w-[1.5px] bg-white"
            />
            <p
              className={cn(
                "text-sm font-medium text-white",
                isLarge && "text-medium",
              )}
            >
              By {author}
            </p>
          </FlexContainer>
          <p
            className={cn(
              "text-sm font-medium text-white",
              isLarge && "text-medium",
            )}
          >
            {readTime} min reads
          </p>
        </FlexContainer>
      </FlexContainer>
    </Link>
  );
};

export default ArticleThumbnail;
