"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateSlug = (title) => {
    let slug = title.toLowerCase().trim();
    slug = slug.replace(/[^a-z0-9]+/g, '-');
    slug = slug.replace(/^-+|-+$/g, '');
    // Append a timestamp to ensure uniqueness
    const timestamp = Date.now();
    return `${slug}-${timestamp}`;
};
exports.default = generateSlug;
