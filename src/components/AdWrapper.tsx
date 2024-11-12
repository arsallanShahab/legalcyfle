import React, { useEffect } from "react";

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
  useEffect(() => {
    try {
      if (window.adsbygoogle && !window.adsbygoogle.loaded) {
        console.log("adsbygoogle loaded");
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle adbanner-customize"
      style={{
        display: "block",
        overflow: "hidden",
      }}
      data-ad-client={"ca-pub-5892936530350741"}
      {...props}
    />
  );
};

export default AdWrapper;
