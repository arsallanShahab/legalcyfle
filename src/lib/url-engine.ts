const specialCharMap: { [key: string]: string } = {
  "!": "excl",
  "@": "at",
  "#": "hash",
  $: "dollar",
  "%": "percent",
  "^": "caret",
  "&": "and",
  "*": "asterisk",
  "(": "lparen",
  ")": "rparen",
  "+": "plus",
  "=": "equals",
  "{": "lbrace",
  "}": "rbrace",
  "[": "lbracket",
  "]": "rbracket",
  ":": "colon",
  ";": "semicolon",
  '"': "quote",
  "'": "apos",
  "<": "lt",
  ">": "gt",
  ",": "comma",
  ".": "dot",
  "?": "question",
  "/": "slash",
  "\\": "backslash",
  "|": "pipe",
  "`": "backtick",
  "~": "tilde",
  " ": "space",
};

const reverseSpecialCharMap = Object.fromEntries(
  Object.entries(specialCharMap).map(([key, value]) => [value, key]),
);

/**
 * Converts a title to a URL-friendly string.
 * @param title - The title to convert.
 * @returns The URL-friendly string.
 */
export function titleToUrl(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .split("")
    .map((char) => specialCharMap[char] || char)
    .join("-")
    .replace(/-+/g, "-"); // Replace multiple hyphens with a single hyphen
}

/**
 * Converts a URL-friendly string back to the original title.
 * @param url - The URL-friendly string to convert.
 * @returns The original title.
 */
export function urlToTitle(url: string): string {
  return url
    .split("-")
    .map((part) => reverseSpecialCharMap[part] || part)
    .join("")
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
}
