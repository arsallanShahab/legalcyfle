import React, { useEffect, useRef } from "react";
import FlexContainer from "./FlexContainer";

declare global {
  interface Window {
    adsbygoogle: {
      loaded: boolean;
      push: (x: any) => void;
    };
  }
}

type Props = {};

const AdWrapper = (props: Props) => {
  const adInitialized = useRef(false);

  useEffect(() => {
    // Only initialize ads in production
    if (process.env.NODE_ENV !== "production") {
      return;
    }

    let retries = 0;
    const maxRetries = 5;

    const tryInitializeAd = () => {
      if (adInitialized.current) return;

      try {
        if (typeof window !== "undefined" && window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          adInitialized.current = true;
          return true;
        }
      } catch (err) {
        console.error("AdSense initialization error:", err);
        retries++;
        if (retries < maxRetries) {
          setTimeout(tryInitializeAd, 1000 * retries); // Exponential backoff
        }
      }
      return false;
    };

    // Initial attempt
    if (!tryInitializeAd()) {
      // Fallback: check periodically
      const intervalId = setInterval(() => {
        if (tryInitializeAd()) {
          clearInterval(intervalId);
        }
      }, 2000);

      // Cleanup after 30 seconds
      const timeoutId = setTimeout(() => {
        clearInterval(intervalId);
      }, 30000);

      return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      };
    }
  }, []);

  if (process.env.NODE_ENV === "development") {
    return (
      <FlexContainer variant="row-center" className="w-full flex-1">
        <div
          className="adsbygoogle adbanner-customize"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            width: "100%",
            minWidth: "250px",
            height: "100px",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
          }}
          {...props}
        >
          <h3 className="text-gray-400">Ads will be shown here</h3>
        </div>
      </FlexContainer>
    );
  }

  return (
    <FlexContainer variant="row-center" className="w-full flex-1">
      <ins
        className="adsbygoogle adbanner-customize"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          width: "100%",
          minWidth: "250px",
        }}
        data-ad-client={"ca-pub-5892936530350741"}
        {...props}
      />
    </FlexContainer>
  );
};

export default AdWrapper;
