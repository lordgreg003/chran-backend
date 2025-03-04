"use strict";
exports.__esModule = true;
var generateSlug = function (title) {
    var slug = title.toLowerCase().trim();
    slug = slug.replace(/[^a-z0-9]+/g, '-');
    slug = slug.replace(/^-+|-+$/g, '');
    // Append a timestamp to ensure uniqueness
    var timestamp = Date.now();
    return slug + "-" + timestamp;
};
exports["default"] = generateSlug;
