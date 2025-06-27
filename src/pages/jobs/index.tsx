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
  jobs: {
    fields: {
      articles: BlogEntry[];
      title: string;
    };
  };
};

const Index = ({ jobs }: Props) => {
  const { getData, loading, data, error, refresh } = useGet<
    ApiResponse<MetricsResponse>
  >({ showToast: true });

  const reversedArticles = [...jobs.fields?.articles].reverse();

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
      <FlexContainer variant="row-between">
        <Heading>{jobs.fields?.title}</Heading>
        <Button variant={"secondary"}>
          <Eye className="h-4 w-4" />
          {data?.data?.view}
        </Button>
      </FlexContainer>
      <FlexContainer variant="column-start" gap="xl">
        {reversedArticles.map((article) => {
          return (
            <article key={article.sys.id}>
              <Card>
                <CardHeader className="p-4 md:p-7">
                  <FlexContainer variant="column-start">
                    <h3 className="max-w-lg font-giest-sans text-2xl md:text-3xl">
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
                <Divider />
                <CardBody className="blog-small p-4 md:p-7">
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
        content_type: "job",
        select: ["fields.title", "fields.articles", "sys.id"],
        limit: 1,
      })
      .catch((error) => {
        console.error("Error fetching internships:", error);
        return { items: [] };
      });

    console.log("Internships fetched:", internships);

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
                body: article.fields.body,
              },
            }))
          : [],
      },
    };

    return {
      props: {
        jobs: minimalInternship,
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return { notFound: true };
  }
}

export default Index;
