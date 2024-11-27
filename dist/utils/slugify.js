"use strict";
// utils/slugify.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSlug = void 0;
/**
 * Generates a URL-friendly slug from a string
 * @param text - The input string to be converted into a slug
 * @returns A URL-friendly slug
 */
const generateSlug = (text) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, "-") // Replace spaces, non-word characters, and hyphens with a single hyphen
        .replace(/^-+|-+$/g, ""); // Remove leading or trailing hyphens
};
exports.generateSlug = generateSlug;
