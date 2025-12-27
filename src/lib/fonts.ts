import { Inter, Playfair_Display, Lora } from "next/font/google";

export const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
export const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
export const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });

// usuage
// className={`${inter.variable} ${playfair.variable} ${lora.variable} font-sans`}
