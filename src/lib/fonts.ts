import {
  Inter,
  Playfair_Display,
  Lora,
  Italiana,
  Croissant_One,
} from "next/font/google";

export const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
export const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});
export const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });
export const italiana = Italiana({
  subsets: ["latin"],
  variable: "--font-italiana",
  weight: ["400"],
});
export const croissantOne = Croissant_One({
  subsets: ["latin"],
  variable: "--font-croissant-one",
  weight: ["400"],
});

// usuage
// className={`${inter.variable} ${playfair.variable} ${lora.variable} font-sans`}
