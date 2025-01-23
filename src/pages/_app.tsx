import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { WhatsappIcon } from "@/components/icons";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { useGlobalContext } from "@/context/GlobalContext";
import "@/styles/globals.css";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { AppProps } from "next/app";
import Link from "next/link";
import Script from "next/script";
import "swiper/css";

// TODO:- recommended post
// - next page
// - loading preview
// - Back to the top button
// - join the whatsapp group in every page
// - social media links header / footer
// - toggle theme in mobile not working
// - picture size full In mobile / desktop
// - keep me logged in option/ remember me
// - Merge Google analytics and Google Adsense

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <Script
        id="adsbygoogle-init"
        crossOrigin="anonymous"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5892936530350741"
      />
      <Navbar />
      <main className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <Component {...pageProps} />
      </main>
      <div className="fixed bottom-5 right-5">
        <Link
          target="_blank"
          href={"https://chat.whatsapp.com/LYroveHgsMMLvbpIqVPKCe"}
          className="flex w-auto rounded-[99px] bg-[#25D366] p-5 duration-200 hover:bg-[rgb(28,162,77)] active:scale-95"
        >
          <WhatsappIcon className="h-7 w-7 fill-white text-white" />
        </Link>
      </div>
      <Footer />
      {/* <GoogleAnalytics gaId="G-Q4PRKNHZDN" /> */}
      <GoogleAnalytics gaId="G-27Z23YH8R9" />
    </Providers>
  );
}
