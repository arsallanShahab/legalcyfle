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
    if (q) {
      const filtered = props.data.filter((article) => {
        if (typeof q === "object") {
          return false;
        }
        if (q.length === 0) {
          return false;
        }
        if (typeof q === "string") {
          return article.fields.title.toLowerCase().includes(q.toLowerCase());
        }
      });
      setFilteredArticles(filtered);
    }
  }, [q]);

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

export async function getStaticProps() {
  const articles = await client.getEntries({
    content_type: "blogPage",
    order: ["-sys.createdAt"],
    select: [
      "fields.title,fields.slug,fields.category,fields.image,fields.authors,fields.description,fields.date",
    ],
  });
  console.log(articles, "search");
  const safeJsonArticles = articles.items;
  return {
    props: {
      data: safeJsonArticles,
    },
  };
}

export default Index;
