import BlogContent from "@/components/Blog";
import FlexContainer from "@/components/FlexContainer";
import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import Wrapper from "@/components/Wrapper";
import client from "@/lib/contentful";
import useGet from "@/lib/hooks/use-get";
import { BlogEntry } from "@/types/contentful/blog";
import { ApiResponse, MetricsResponse } from "@/types/global/api-response";
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import { Eye } from "lucide-react";
import React, { useEffect } from "react";

type Props = {
  internships: {
    fields: {
      articles: BlogEntry[];
      title: string;
    };
  };
};

const Index = ({ internships }: Props) => {
  const { getData, loading, data, error, refresh } = useGet<
    ApiResponse<MetricsResponse>
  >({ showToast: false });

  const reversedArticles = [...internships.fields?.articles].reverse();

  useEffect(() => {
    getData(
      `/api/articles/internships-metrics/metrics`,
      "internships-metrics",
      {
        loading: "Loading metrics...",
        success: "Metrics loaded successfully",
        failure: "Failed to load metrics",
      },
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internships]);
  return (
    <Wrapper>
      <FlexContainer variant="row-between">
        <Heading className="font-google text-4xl font-black tracking-tight text-black dark:text-white md:text-5xl">
          {internships.fields?.title}
        </Heading>
        {/* <Button variant={"secondary"}>
          <Eye className="h-4 w-4" />
          {data?.data?.view}
        </Button> */}
      </FlexContainer>
      <FlexContainer variant="column-start" gap="xl">
        {reversedArticles.map((article) => {
          return (
            <article key={article.sys.id}>
              <Card className="rounded-xl border border-gray-200 bg-zinc-50 shadow-none dark:border-gray-800 dark:bg-zinc-900">
                <CardHeader className="rounded-xl rounded-b-none border-b bg-white p-5 dark:bg-zinc-800">
                  <FlexContainer variant="column-start">
                    <h3 className="font-google mb-3 max-w-xl text-3xl font-bold leading-tight text-gray-900 dark:text-white md:text-4xl">
                      {article?.fields?.title}
                    </h3>
                    <p className="text-small text-default-500">
                      {new Date(article?.sys?.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </FlexContainer>
                </CardHeader>
                <CardBody className="rounded-xl border-gray-200 bg-zinc-50 p-5 dark:border-gray-800 dark:bg-zinc-900">
                  <BlogContent data={article} />
                </CardBody>
              </Card>
            </article>
          );
        })}
      </FlexContainer>
    </Wrapper>
  );
};

export async function getStaticProps() {
  try {
    const internships = await client
      .getEntries({
        content_type: "internships",
        select: ["fields.title", "fields.articles", "sys.id"],
        include: 1,
        limit: 1,
      })
      .catch((error) => {
        console.error("Error fetching internships:", error);
        return { items: [] };
      });

    if (!internships?.items?.length) {
      return { notFound: true };
    }

    const minimalInternship = {
      sys: { id: internships.items[0].sys.id },
      fields: {
        title: internships.items[0].fields.title,
        articles: Array.isArray(internships.items[0].fields.articles)
          ? internships.items[0].fields.articles.map((article: any) => ({
              sys: {
                id: article.sys.id,
                createdAt: article.sys.createdAt,
              },
              fields: {
                title: article.fields.title,
                body: article.fields.body
                  ? {
                      nodeType: article.fields.body.nodeType,
                      content: article.fields.body.content,
                    }
                  : {},
              },
            }))
          : [],
      },
    };

    return {
      props: {
        internships: minimalInternship,
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return { notFound: true };
  }
}

export default Index;
