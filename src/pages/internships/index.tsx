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
import safeJsonStringify from "safe-json-stringify";

type Internships = {};

type Props = {
  internships: {
    fields: {
      articles: BlogEntry[];
      title: string;
    };
  }; // Adjust type as needed
};

const Index = ({ internships }: Props) => {
  console.log(internships);

  const { getData, loading, data, error, refresh } = useGet<
    ApiResponse<MetricsResponse>
  >({ showToast: true });

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
        <Heading>{internships.fields?.title}</Heading>
        <Button variant={"secondary"}>
          <Eye className="h-4 w-4" />
          {data?.data?.view}
        </Button>
      </FlexContainer>
      <FlexContainer variant="column-start" gap="xl">
        {[...internships.fields?.articles].reverse().map((article) => {
          return (
            <article key={article.sys.id}>
              <Card>
                <CardHeader className="p-4 md:p-7">
                  {/* <Image
                  alt="heroui logo"
                  height={40}
                  radius="sm"
                  src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                  width={40}
                /> */}
                  <FlexContainer variant="column-start">
                    <h3 className="max-w-lg font-giest-sans text-2xl md:text-3xl">
                      {article?.fields?.title}
                    </h3>
                    {/* <p className="text-small text-default-500">
                {article.fields?.category
                  ?.map((e) => e?.fields?.name)
                  .join(",")}
                  </p> */}
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
    // Only fetch the specific fields you need
    const internships = await client
      .getEntries({
        content_type: "internships",
        select: ["fields.title", "fields.articles", "sys.id"],
        include: 1, // Reduce include depth to 2 levels
        limit: 1, // You only need the first item
      })
      .catch((error) => {
        console.error("Error fetching internships:", error);
        return { items: [] };
      });

    if (!internships?.items?.length) {
      return { notFound: true };
    }

    // Extract only the data you need from each article
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
                // For rich text, only keep essential content structure
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

    // Safely stringify the minimal data
    let safeJsonArticle = {};
    try {
      safeJsonArticle = JSON.parse(safeJsonStringify(minimalInternship));
    } catch (error) {
      console.error("Error stringifying minimal data:", error);
      safeJsonArticle = minimalInternship;
    }

    return {
      props: {
        internships: safeJsonArticle,
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return { notFound: true };
  }
}

export default Index;
