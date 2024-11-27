// utils/slugify.ts

/**
 * Generates a URL-friendly slug from a string
 * @param text - The input string to be converted into a slug
 * @returns A URL-friendly slug
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-") // Replace spaces, non-word characters, and hyphens with a single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading or trailing hyphens
};
