import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { useGlobalContext } from "@/context/GlobalContext";
import "@/styles/globals.css";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { AppProps } from "next/app";
import "swiper/css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <Navbar />
      <main className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <Component {...pageProps} />
      </main>
      <Footer />
    </Providers>
  );
}
