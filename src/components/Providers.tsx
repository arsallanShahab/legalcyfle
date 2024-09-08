import { GlobalProvider } from "@/context/GlobalContext";
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/router";
import React from "react";
import { Toaster } from "react-hot-toast";
import ThemeProviders from "./ThemeProviders";

type Props = {
  children: React.ReactNode;
};

const Providers = (props: Props) => {
  const router = useRouter();
  return (
    <GlobalProvider>
      <NextUIProvider className="dark:bg-zinc-900" navigate={router.push}>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#000",
              color: "#fff",
              borderRadius: "99px",
              fontFamily: "Rubik",
              fontWeight: "500",
            },
          }}
        />
        <ThemeProviders>{props.children}</ThemeProviders>
      </NextUIProvider>
    </GlobalProvider>
  );
};

export default Providers;
