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
    const intervalId = setInterval(() => {
      if (!adInitialized.current && window.adsbygoogle) {
        let adsbygoogle = window.adsbygoogle || [];
        try {
          (adsbygoogle = window.adsbygoogle || []).push({});
          adInitialized.current = true;
          clearInterval(intervalId); // Clear the interval once adsbygoogle is available
        } catch (err) {
          console.log(err);
        }
      }
    }, 1000); // Check every second

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
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
