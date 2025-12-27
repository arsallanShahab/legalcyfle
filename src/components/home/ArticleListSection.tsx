import AdWrapper from "@/components/AdWrapper";
import ArticleCard from "@/components/ArticleCard";
import FlexContainer from "@/components/FlexContainer";
import { italiana, playfair } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { BlogEntry } from "@/types/contentful/blog";

interface ArticleListSectionProps {
  title: string;
  articles: BlogEntry[];
  adSlot?: string;
}

export default function ArticleListSection({
  title,
  articles,
  adSlot = "5536160107",
}: ArticleListSectionProps) {
  return (
    <FlexContainer variant="column-start" className="px-3 md:px-5 lg:px-10">
      <div className="mb-4 mt-6 w-full border-b-2 border-zinc-200 pb-2 dark:border-white">
        <h3
          className={cn(
            "text-3xl font-bold tracking-tight text-gray-900 dark:text-white",
            playfair.className,
          )}
        >
          {title}
        </h3>
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex flex-1 flex-col gap-4 divide-y divide-gray-200 dark:divide-gray-700">
          {articles?.map((article: BlogEntry) => {
            return <ArticleCard article={article} key={article.sys.id} />;
          })}
        </div>
        <div className="w-[300px] border-l border-gray-200 pl-4 dark:border-gray-700">
          <div className="sticky top-4">
            <p className="mb-2 font-sans text-xs font-bold uppercase tracking-widest text-gray-400">
              Advertisement
            </p>
            <AdWrapper
              data-ad-layout="in-article"
              data-ad-format="fluid"
              data-ad-slot={adSlot}
            />
          </div>
        </div>
      </div>
    </FlexContainer>
  );
}
