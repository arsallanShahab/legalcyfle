import { ThemeProvider as NextThemesProvider } from "next-themes";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const ThemeProviders = (props: Props) => {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem>
      {props.children}
    </NextThemesProvider>
  );
};

export default ThemeProviders;
