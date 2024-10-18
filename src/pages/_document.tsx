// import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      {/* <GoogleTagManager gtmId="GTM-K7R2F9MQ" /> */}
      <body>
        <Main />
        <NextScript />
      </body>
      {/* <GoogleAnalytics gaId="G-27Z23YH8R9" /> */}
    </Html>
  );
}
