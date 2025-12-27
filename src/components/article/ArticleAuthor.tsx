import FlexContainer from "@/components/FlexContainer";
import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { italiana } from "@/lib/fonts";
import { cn, formatImageLink } from "@/lib/utils";
import { BlogEntry } from "@/types/contentful/blog";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ArticleAuthorProps {
  article: BlogEntry;
}

const ArticleAuthor: React.FC<ArticleAuthorProps> = ({ article }) => {
  const author = article.fields.authors?.[0];

  if (!author) return null;

  const authorName = author.fields.name;
  const authorBio =
    author.fields.bio ||
    `An expert contributor to LegalCyfle, sharing insights on ${article.fields.category?.[0]?.fields?.name || "law and technology"}.`;
  const authorId = author.sys.id;
  const authorImage = author.fields.avatar?.fields?.file?.url
    ? formatImageLink(author.fields.avatar.fields.file.url)
    : "/placeholder-user.jpg";

  return (
    <section className="article-author mt-8 rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900/50 md:mt-12 md:p-8">
      <FlexContainer variant="column-start" gap="md">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-full border-4 border-white shadow-sm dark:border-gray-800">
            <Image
              src={authorImage}
              alt={authorName}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <span className="mb-1 font-sans text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              About the Author
            </span>
            <Heading
              level={3}
              className={cn(
                "mb-2 text-2xl font-semibold text-black dark:text-white",
                italiana.className,
              )}
            >
              {authorName}
            </Heading>
            <p className="font-lora mb-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-300">
              {authorBio}
            </p>
            <Link href={`/author/${authorId}`}>
              <Button variant="outline" className="group gap-2">
                View Profile
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </FlexContainer>
    </section>
  );
};

export default ArticleAuthor;
