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
    if (!adInitialized.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        adInitialized.current = true;
      } catch (err) {
        console.log(err);
      }
    }
  }, []);

  return (
    <FlexContainer variant="row-center" className="w-full flex-1">
      <ins
        className="adsbygoogle adbanner-customize"
        style={{
          display: "block",
          overflow: "hidden",
          width: "100%",
        }}
        data-ad-client={"ca-pub-5892936530350741"}
        {...props}
      />
    </FlexContainer>
  );
};

export default AdWrapper;
