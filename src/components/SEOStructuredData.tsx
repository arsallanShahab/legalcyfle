import { useEffect } from "react";

interface SEOStructuredDataProps {
  articleData: {
    title: string;
    description?: string;
    author?: string;
    datePublished?: string;
    dateModified?: string;
    url?: string;
    image?: string;
    category?: string;
  };
}

const SEOStructuredData = ({ articleData }: SEOStructuredDataProps) => {
  useEffect(() => {
    // Create JSON-LD structured data for articles
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: articleData.title,
      description: articleData.description || "",
      author: {
        "@type": "Person",
        name: articleData.author || "Legal Cyfle",
      },
      publisher: {
        "@type": "Organization",
        name: "Legal Cyfle",
        logo: {
          "@type": "ImageObject",
          url: `${typeof window !== "undefined" ? window.location.origin : ""}/logo-black.png`,
        },
      },
      datePublished: articleData.datePublished || new Date().toISOString(),
      dateModified: articleData.dateModified || new Date().toISOString(),
      url:
        articleData.url ||
        (typeof window !== "undefined" ? window.location.href : ""),
      image:
        articleData.image ||
        `${typeof window !== "undefined" ? window.location.origin : ""}/cover.png`,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id":
          articleData.url ||
          (typeof window !== "undefined" ? window.location.href : ""),
      },
      articleSection: articleData.category || "Legal",
    };

    // Remove existing structured data
    const existingScript = document.querySelector(
      'script[type="application/ld+json"]',
    );
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount
      const scriptToRemove = document.querySelector(
        'script[type="application/ld+json"]',
      );
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [articleData]);

  return null;
};

export default SEOStructuredData;
