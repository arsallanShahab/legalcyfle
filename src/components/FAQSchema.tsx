interface FAQSchema {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQSchema[];
  articleTitle: string;
  articleUrl: string;
}

const generateFAQSchema = ({
  faqs,
  articleTitle,
  articleUrl,
}: FAQSchemaProps) => {
  if (!faqs || faqs.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
    about: {
      "@type": "Article",
      name: articleTitle,
      url: articleUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default generateFAQSchema;
