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
                <CardHeader className="p-7">
                  {/* <Image
                  alt="heroui logo"
                  height={40}
                  radius="sm"
                  src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                  width={40}
                /> */}
                  <FlexContainer variant="column-start">
                    <h3 className="max-w-lg font-giest-sans text-3xl">
                      {article.fields.title}
                    </h3>
                    {/* <p className="text-small text-default-500">
                {article.fields?.category
                  ?.map((e) => e?.fields?.name)
                  .join(",")}
                  </p> */}
                    <p className="text-small text-default-500">
                      {new Date(article.sys.createdAt).toLocaleDateString(
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
                <CardBody className="blog-small p-7">
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
  const internships = await client.getEntries({
    content_type: "internships",
    // include: 3,
  });
  console.log(internships.items[0]?.fields.articles, "internships");
  if (!internships.items.length) {
    return {
      notFound: true,
    };
  }
  // Remove circular references
  const safeJsonArticle = JSON.parse(safeJsonStringify(internships.items[0]));
  console.log(safeJsonArticle);
  return {
    props: {
      internships: safeJsonArticle,
    },
  };
}

export default Index;
