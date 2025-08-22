import Head from "next/head";
import { useRouter } from "next/router";

interface SEOOptimizationsProps {
  preloadImages?: string[];
  preconnectDomains?: string[];
  prefetchUrls?: string[];
}

const SEOOptimizations = ({
  preloadImages = [],
  preconnectDomains = [],
  prefetchUrls = [],
}: SEOOptimizationsProps) => {
  const router = useRouter();

  return (
    <Head>
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="preconnect" href="https://images.ctfassets.net" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="preconnect" href="https://www.google-analytics.com" />

      {preconnectDomains.map((domain, index) => (
        <link key={index} rel="preconnect" href={domain} />
      ))}

      {/* Preload critical images */}
      {preloadImages.map((image, index) => (
        <link
          key={index}
          rel="preload"
          href={image}
          as="image"
          type="image/webp"
        />
      ))}

      {/* DNS prefetch for better performance */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//images.ctfassets.net" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />

      {/* Prefetch critical pages */}
      {prefetchUrls.map((url, index) => (
        <link key={index} rel="prefetch" href={url} />
      ))}

      {/* Critical CSS inlining hint */}
      <link
        rel="preload"
        href="/styles/critical.css"
        as="style"
        onLoad={() => {}}
      />

      {/* Viewport meta for mobile optimization */}
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, viewport-fit=cover"
      />

      {/* Theme color for mobile browsers */}
      <meta name="theme-color" content="#1f2937" />
      <meta name="msapplication-TileColor" content="#1f2937" />

      {/* Alternate hreflang for international SEO (if applicable) */}
      <link
        rel="alternate"
        hrefLang="en"
        href={`https://legalcyfle.in${router.asPath}`}
      />

      {/* Security headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
    </Head>
  );
};

export default SEOOptimizations;
