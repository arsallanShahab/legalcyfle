import ArticleCard from "@/components/ArticleCard";
import FlexContainer from "@/components/FlexContainer";
import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { BlogEntry } from "@/types/contentful/blog";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

interface RecommendedArticlesProps {
  articles: BlogEntry[];
  currentCategory?: {
    title: string;
    slug: string;
  };
}

const RecommendedArticles: React.FC<RecommendedArticlesProps> = ({
  articles,
  currentCategory,
}) => {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="article-recommended mt-8 border-t border-gray-200 pt-8 dark:border-gray-800 md:mt-16 md:pt-12">
      <FlexContainer variant="column-start" gap="lg">
        <div className="flex w-full items-end justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
          <div>
            <span className="font-google mb-2 block text-xs font-bold uppercase tracking-wider text-primary">
              Read Next
            </span>
            <Heading
              level={2}
              className="font-google text-3xl font-bold text-gray-900 dark:text-white"
            >
              Related Articles
            </Heading>
          </div>
          {currentCategory && (
            <Link
              href={`/category/${currentCategory.slug}`}
              className="hidden sm:block"
            >
              <Button
                variant="ghost"
                className="group gap-2 text-gray-600 dark:text-gray-400"
              >
                More in {currentCategory.title}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          )}
        </div>

        <div className="grid gap-8">
          {articles.slice(0, 3).map((article) => (
            <ArticleCard key={article.sys.id} article={article} />
          ))}
        </div>

        {currentCategory && (
          <div className="mt-4 flex justify-center sm:hidden">
            <Link href={`/category/${currentCategory.slug}`}>
              <Button variant="outline" className="w-full gap-2">
                View All Related Articles
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </FlexContainer>
    </section>
  );
};

export default RecommendedArticles;
