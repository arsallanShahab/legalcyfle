import React, { useEffect, useRef, useState } from "react";
import FlexContainer from "./FlexContainer";

declare global {
  interface Window {
    adsbygoogle: {
      loaded: boolean;
      push: (x: any) => void;
    };
  }
}

type AdFormat = "auto" | "fluid" | "rectangle" | "vertical" | "horizontal";

interface Props {
  slot: string;
  format?: AdFormat;
  layoutKey?: string;
  layout?: string;
  style?: React.CSSProperties;
  responsive?: boolean;
  className?: string;
  testMode?: boolean;
}

const DynamicAdWrapper: React.FC<Props> = ({
  slot,
  format = "auto",
  layoutKey,
  layout,
  style,
  responsive = true,
  className = "",
  testMode = false,
  ...props
}) => {
  const adRef = useRef<HTMLModElement>(null);
  const adInitialized = useRef(false);
  const [isClient, setIsClient] = useState(false);

  // Generate stable ID that works for both SSR and client
  const adId = `ad-${slot}`;

  useEffect(() => {
    // Set client flag to avoid hydration mismatch
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Don't initialize ads in development unless explicitly testing
    if (process.env.NODE_ENV === "development" && !testMode) {
      return;
    }

    // Only run on client side
    if (!isClient) return;

    const tryInitializeAd = () => {
      if (adInitialized.current || !window.adsbygoogle || !adRef.current) {
        return false;
      }

      try {
        // Check if this specific ad slot has already been initialized
        const existingAds = document.querySelectorAll(
          `[data-ad-slot="${slot}"]`,
        );
        const alreadyInitialized = Array.from(existingAds).some(
          (ad) =>
            ad !== adRef.current && ad.getAttribute("data-adsbygoogle-status"),
        );

        if (alreadyInitialized) {
          console.warn(
            `Ad slot ${slot} is already initialized on this page. Consider using different ad slots.`,
          );
          return true;
        }

        // Initialize the ad
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        adInitialized.current = true;
        return true;
      } catch (error) {
        console.error("Error initializing ad:", error);
        return false;
      }
    };

    // Try immediate initialization
    if (tryInitializeAd()) {
      return;
    }

    // If not ready, poll until adsbygoogle is available
    const intervalId = setInterval(() => {
      if (tryInitializeAd()) {
        clearInterval(intervalId);
      }
    }, 1000);

    // Cleanup
    return () => {
      clearInterval(intervalId);
    };
  }, [slot, testMode, isClient]);

  // Development mode display
  if (process.env.NODE_ENV === "development" && !testMode) {
    return (
      <FlexContainer
        variant="row-center"
        className={`w-full flex-1 ${className}`}
      >
        <div
          className="adsbygoogle adbanner-customize border-2 border-dashed border-gray-300"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            width: "100%",
            minWidth: "250px",
            height: "100px",
            backgroundColor: "rgba(0, 0, 0, 0.05)",
            ...style,
          }}
        >
          <div className="text-center">
            <h3 className="text-sm font-medium text-gray-400">
              Google Ad Slot: {slot}
            </h3>
            <p className="mt-1 text-xs text-gray-300">
              Format: {format} | Responsive: {responsive ? "Yes" : "No"}
            </p>
          </div>
        </div>
      </FlexContainer>
    );
  }

  // Don't render the ad until client-side hydration is complete
  if (!isClient) {
    return (
      <FlexContainer
        variant="row-center"
        className={`w-full flex-1 ${className}`}
      >
        <div
          style={{
            width: "100%",
            minWidth: "250px",
            height: "100px",
            ...style,
          }}
        />
      </FlexContainer>
    );
  }

  // Production ad display
  const adStyle = {
    display: "block",
    width: "100%",
    minWidth: "250px",
    ...style,
  };

  return (
    <FlexContainer
      variant="row-center"
      className={`w-full flex-1 ${className}`}
    >
      <ins
        ref={adRef}
        id={adId}
        className={`adsbygoogle adbanner-customize ${className}`}
        style={adStyle}
        data-ad-client="ca-pub-5892936530350741"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
        {...(layoutKey && { "data-ad-layout-key": layoutKey })}
        {...(layout && { "data-ad-layout": layout })}
        {...props}
      />
    </FlexContainer>
  );
};

export default DynamicAdWrapper;
