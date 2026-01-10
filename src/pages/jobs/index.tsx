import BlogContent from "@/components/Blog";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import FlexContainer from "@/components/FlexContainer";
import Wrapper from "@/components/Wrapper";
import client from "@/lib/contentful";
import { minifyJob, minifyJobToMarkdown } from "@/lib/contentful-minifier";
import useGet from "@/lib/hooks/use-get";
import { ApiResponse, MetricsResponse } from "@/types/global/api-response";
import { Eye } from "lucide-react";
import React, { useEffect } from "react";

type Props = {
  jobs: {
    fields: {
      articles: any[];
      title: string;
    };
  };
};

const Index = ({ jobs }: Props) => {
  const { getData, loading, data, error, refresh } = useGet<
    ApiResponse<MetricsResponse>
  >({ showToast: false });

  const reversedArticles = [...(jobs?.fields?.articles ?? [])].reverse();

  useEffect(() => {
    getData(`/api/articles/jobs-metrics/metrics`, "jobs-metrics", {
      loading: "Loading metrics...",
      success: "Metrics loaded successfully",
      failure: "Failed to load metrics",
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobs]);
  return (
    <Wrapper>
      <FlexContainer
        variant="row-between"
        className="mb-8 border-b-2 border-zinc-200 pb-4 dark:border-gray-700 md:mb-12"
      >
        <h1 className="font-playfair text-4xl font-black tracking-tight text-black dark:text-white md:text-5xl">
          {jobs?.fields?.title || "Jobs"}
        </h1>
        {/* <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          <Eye className="h-4 w-4" />
          <span>{data?.data?.view || 0} views</span>
        </div> */}
      </FlexContainer>

      <div className="mx-auto flex max-w-4xl flex-col gap-12 md:gap-16">
        {reversedArticles?.map((article) => {
          return (
            <article
              key={article.sys.id}
              className="border-b border-gray-200 pb-12 last:border-0 dark:border-gray-800"
            >
              <header className="mb-6">
                <h2 className="mb-3 font-playfair text-3xl font-bold leading-tight text-gray-900 dark:text-white md:text-4xl">
                  {article?.fields?.title}
                </h2>
                <div className="flex items-center font-lora text-sm italic text-gray-500">
                  {article?.fields?.date && (
                    <time
                      dateTime={new Date(article.fields.date).toISOString()}
                    >
                      Published on{" "}
                      {new Date(article.fields.date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </time>
                  )}
                </div>
              </header>

              <div className="prose prose-lg dark:prose-invert max-w-none">
                {typeof article.fields.body === "string" ? (
                  <MarkdownRenderer content={article.fields.body} />
                ) : (
                  <BlogContent data={article} />
                )}
              </div>
            </article>
          );
        })}
      </div>
    </Wrapper>
  );
};

export async function getStaticProps() {
  try {
    const internships = await client
      .getEntries({
        content_type: "job",
        select: ["fields.title", "fields.articles", "sys.id"],
        limit: 1,
      })
      .catch((error) => {
        console.error("Error fetching internships:", error);
        return { items: [] };
      });

    // Use the new markdown minifier for better compression
    const minifiedJob = minifyJobToMarkdown(internships.items[0]);

    // Development logging for data compression
    if (process.env.NODE_ENV === "development") {
      const originalSize = JSON.stringify(internships.items[0]).length;
      const standardMinified = minifyJob(internships.items[0]);
      const standardMinifiedSize = JSON.stringify(standardMinified).length;
      const markdownMinifiedSize = JSON.stringify(minifiedJob).length;

      const savedBytes = originalSize - markdownMinifiedSize;
      const savedPercentage = ((savedBytes / originalSize) * 100).toFixed(2);

      const extraSavings = standardMinifiedSize - markdownMinifiedSize;
      const extraSavingsPercentage = (
        (extraSavings / standardMinifiedSize) *
        100
      ).toFixed(2);

      console.log("--- Data Compression Log (Markdown) ---");
      console.log(`Original Size: ${(originalSize / 1024).toFixed(2)} KB`);
      console.log(
        `Standard Minified: ${(standardMinifiedSize / 1024).toFixed(2)} KB`,
      );
      console.log(
        `Markdown Minified: ${(markdownMinifiedSize / 1024).toFixed(2)} KB`,
      );
      console.log(
        `Total Saved: ${(savedBytes / 1024).toFixed(2)} KB (${savedPercentage}%)`,
      );
      console.log(
        `Extra Savings vs Standard: ${(extraSavings / 1024).toFixed(2)} KB (${extraSavingsPercentage}%)`,
      );
      console.log(
        `-----------Minified Size: ${(markdownMinifiedSize / 1024).toFixed(2)} KB`,
      );
      console.log(
        `Saved: ${(savedBytes / 1024).toFixed(2)} KB (${savedPercentage}%)`,
      );
      console.log("----------------------------");
    }

    return {
      props: {
        jobs: minifiedJob,
      },
      revalidate: 604800, //weekly,
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return { notFound: true };
  }
}

export default Index;
