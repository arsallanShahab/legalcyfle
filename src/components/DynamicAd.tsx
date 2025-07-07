import React, { useEffect } from "react";
import FlexContainer from "./FlexContainer";

interface Props {
  slot: string;
  format?: string;
  layoutKey?: string;
  style?: React.CSSProperties;
  className?: string;
  responsive?: boolean;
}

const SimpleAdWrapper: React.FC<Props> = ({
  slot,
  format = "auto",
  layoutKey,
  style,
  className = "",
  responsive = true,
  ...props
}) => {
  useEffect(() => {
    // Only run this on client side and in production
    if (
      typeof window !== "undefined" &&
      process.env.NODE_ENV === "production"
    ) {
      try {
        // This is exactly what Google provides
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense error:", e);
      }
    }
  }, []);

  // Development preview
  if (process.env.NODE_ENV === "development") {
    return (
      <FlexContainer
        variant="row-center"
        className={`w-full ${className} min-w-[250px]`}
      >
        <div
          className="border-2 border-dashed border-gray-300"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            minWidth: "250px",
            height: "250px",
            backgroundColor: "rgba(0, 0, 0, 0.05)",
            ...style,
          }}
        >
          <div className="text-center">
            <h3 className="text-gray-400">Google Ad</h3>
            <p className="text-xs text-gray-300">Slot: {slot}</p>
            <p className="text-xs text-gray-300">Format: {format}</p>
          </div>
        </div>
      </FlexContainer>
    );
  }

  // Production - Exact Google AdSense code
  return (
    <FlexContainer
      variant="row-center"
      className={`w-full ${className} min-w-[250px]`}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          ...style,
        }}
        data-ad-format={format}
        {...(layoutKey && { "data-ad-layout-key": layoutKey })}
        data-ad-client="ca-pub-5892936530350741"
        data-ad-slot={slot}
        {...(responsive && { "data-full-width-responsive": "true" })}
        {...props}
      />
    </FlexContainer>
  );
};

export default SimpleAdWrapper;
