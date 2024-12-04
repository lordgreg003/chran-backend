"use strict";
exports.__esModule = true;
exports.generateSlug = void 0;
// utils/slugify.ts
exports.generateSlug = function (title) {
    // Clean the title to make it URL-friendly
    var baseSlug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
        .replace(/\s+/g, "-") // Replace spaces with dashes
        .replace(/-+/g, "-"); // Replace multiple dashes with a single dash
    // Generate random number between 1 and 1000
    var randomNum = Math.floor(Math.random() * 1000) + 1;
    // Generate random letters (2 characters)
    var randomLetters = String.fromCharCode(97 + Math.floor(Math.random() * 26), 97 + Math.floor(Math.random() * 26));
    // Combine with the slug
    return randomNum + "-" + randomLetters + "-" + baseSlug + "-" + randomNum;
};
