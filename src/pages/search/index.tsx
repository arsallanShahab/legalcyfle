import ArticleCard from "@/components/ArticleCard";
import Heading from "@/components/Heading";
import Wrapper from "@/components/Wrapper";
import client from "@/lib/contentful";
import { BlogEntry } from "@/types/contentful/blog";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import safeJsonStringify from "safe-json-stringify";

type Props = {
  data: BlogEntry[];
};

const Index = (props: Props) => {
  const router = useRouter();
  const { q } = router.query;
  const [filteredArticles, setFilteredArticles] = React.useState<BlogEntry[]>(
    [],
  );

  useEffect(() => {
    setFilteredArticles(props.data);
  }, [props.data]);

  return (
    <Wrapper>
      <Heading>Search results for: {q}</Heading>
      {filteredArticles.length === 0 && (
        <p className="text-xl">No articles found</p>
      )}
      {filteredArticles.map((article) => (
        <ArticleCard key={article.sys.id} article={article} />
      ))}
    </Wrapper>
  );
};

export async function getServerSideProps(context: any) {
  const { q } = context.query;

  const queryParams: any = {
    content_type: "blogPage",
    order: ["-sys.createdAt"],
    select: [
      "fields.title,fields.slug,fields.category,fields.image,fields.authors,fields.description,fields.date",
    ],
  };

  if (q) {
    queryParams["fields.title[match]"] = q;
  }

  const articles = await client.getEntries(queryParams);

  return {
    props: {
      data: articles.items,
    },
  };
}

export default Index;
