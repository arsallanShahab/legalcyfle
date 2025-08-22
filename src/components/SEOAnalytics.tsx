import { useEffect } from "react";

interface SEOAnalyticsProps {
  articleData: {
    title: string;
    slug: string;
    category: string[];
    publishDate: string;
    modifiedDate: string;
    wordCount: number;
    readingTime: number;
  };
}

const SEOAnalytics = ({ articleData }: SEOAnalyticsProps) => {
  useEffect(() => {
    // Track page view for analytics
    if (typeof window !== "undefined") {
      // Google Analytics 4 event
      if (window.gtag) {
        window.gtag("event", "page_view", {
          page_title: articleData.title,
          page_location: window.location.href,
          content_group1: articleData.category[0] || "Uncategorized",
          content_group2: `${articleData.readingTime} min read`,
          content_group3: `${articleData.wordCount} words`,
          custom_map: {
            dimension1: articleData.slug,
            dimension2: articleData.publishDate,
            dimension3: articleData.modifiedDate,
          },
        });
      }

      // Send reading progress events
      let maxScroll = 0;
      const trackScrollProgress = () => {
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.round((scrollTop / docHeight) * 100);

        if (scrollPercent > maxScroll) {
          maxScroll = scrollPercent;

          // Track milestone reading progress
          if ([25, 50, 75, 90, 100].includes(scrollPercent)) {
            if (window.gtag) {
              window.gtag("event", "scroll", {
                event_category: "engagement",
                event_label: `${scrollPercent}% of article`,
                value: scrollPercent,
                content_group1: articleData.category[0] || "Uncategorized",
                custom_map: {
                  dimension1: articleData.slug,
                },
              });
            }
          }
        }
      };

      window.addEventListener("scroll", trackScrollProgress);

      // Track time on page
      const startTime = Date.now();
      const trackTimeOnPage = () => {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        if (window.gtag) {
          window.gtag("event", "timing_complete", {
            name: "time_on_article",
            value: timeSpent,
            event_category: "engagement",
            content_group1: articleData.category[0] || "Uncategorized",
            custom_map: {
              dimension1: articleData.slug,
            },
          });
        }
      };

      window.addEventListener("beforeunload", trackTimeOnPage);

      return () => {
        window.removeEventListener("scroll", trackScrollProgress);
        window.removeEventListener("beforeunload", trackTimeOnPage);
      };
    }
  }, [articleData]);

  return null; // This component doesn't render anything
};

// Global type declaration for gtag
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: object) => void;
  }
}

export default SEOAnalytics;
