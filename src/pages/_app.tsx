import FlexContainer from "@/components/FlexContainer";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { WhatsappIcon } from "@/components/icons";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { useGlobalContext } from "@/context/GlobalContext";
import "@/styles/globals.css";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { ChevronUp } from "lucide-react";
import type { AppProps } from "next/app";
import Head from "next/head";
import Link from "next/link";
import Script from "next/script";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

// TODO:- recommended post
// - picture size full In mobile / desktop
// - keep me logged in option/ remember me
// - Merge Google analytics and Google Adsense

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5892936530350741"
          crossOrigin="anonymous"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Handle MRAID and AdSense errors gracefully
              window.addEventListener('error', function(e) {
                if (e.filename && e.filename.includes('mraid.js')) {
                  console.warn('MRAID script error handled:', e.message);
                  e.preventDefault();
                }
                if (e.message && e.message.includes('adsbygoogle')) {
                  console.warn('AdSense error handled:', e.message);
                  e.preventDefault();
                }
              });
              
              // Ensure adsbygoogle array exists
              window.adsbygoogle = window.adsbygoogle || [];
            `,
          }}
        />
      </Head>
      <Navbar />
      <main className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <Component {...pageProps} />
      </main>
      <FlexContainer variant="column-end" className="fixed bottom-5 right-5">
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex w-auto rounded-[99px] bg-zinc-700 p-5 shadow-md duration-200 active:scale-95"
        >
          <ChevronUp className="h-7 w-7 text-white" />
        </button>
        <Link
          target="_blank"
          href={"https://chat.whatsapp.com/LYroveHgsMMLvbpIqVPKCe"}
          className="flex w-auto rounded-[99px] bg-[#25D366] p-5 shadow-xl duration-200 hover:bg-[rgb(28,162,77)] active:scale-95"
        >
          <WhatsappIcon className="h-7 w-7 fill-white text-white" />
        </Link>
      </FlexContainer>
      <Footer />
      {/* <GoogleAnalytics gaId="G-Q4PRKNHZDN" /> */}
      <GoogleAnalytics gaId="G-27Z23YH8R9" />
    </Providers>
  );
}
