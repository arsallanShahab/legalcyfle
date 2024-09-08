import IUser from "@/types/global/user";
import { type ClassValue, clsx } from "clsx";
import { sign, verify } from "jsonwebtoken";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function estimateReadingTime(text: string) {
  const wordsPerMinute = 150;
  const words = text.split(/\s+/).length;
  const readingTime = Math.ceil(words / wordsPerMinute);
  return readingTime;
}

export function formatImageLink(url: string) {
  return url.startsWith("http") ? url : `https:${url}`;
}

export function excerpt(text: string, length: number) {
  const sliced = text.length > length ? `${text.slice(0, length)}...` : text;
  return sliced;
}

export const sanitizeString = (str: string) => {
  return str.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
};

export const generateJWT = (user: IUser) => {
  return sign({ user }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

export const verifyJWT = (token: string) => {
  return verify(token, process.env.JWT_SECRET as string);
};

// Function to remove circular references and handle undefined values
export const removeCircularReferences = (
  obj: {
    [key: string]: any;
  },
  seen = new WeakSet(),
) => {
  if (obj && typeof obj === "object") {
    if (seen.has(obj)) {
      return;
    }
    seen.add(obj);
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] === undefined) {
          obj[key] = null;
        } else {
          obj[key] = removeCircularReferences(obj[key], seen);
        }
      }
    }
  }
  return obj;
};
