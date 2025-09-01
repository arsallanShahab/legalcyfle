// import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* RSS Feed Discovery */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="LegalCyfle RSS Feed"
          href="/rss.xml"
        />
        <link
          rel="alternate"
          type="application/atom+xml"
          title="LegalCyfle Atom Feed"
          href="/rss.xml"
        />
        {/* JSON Feed for modern readers */}
        <link
          rel="alternate"
          type="application/json"
          title="LegalCyfle JSON Feed"
          href="/api/feed.json"
        />
      </Head>
      {/* <GoogleTagManager gtmId="GTM-K7R2F9MQ" /> */}
      <body>
        <Main />
        <NextScript />
      </body>
      {/* <GoogleAnalytics gaId="G-27Z23YH8R9" /> */}
    </Html>
  );
}
