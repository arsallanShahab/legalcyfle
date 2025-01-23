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
