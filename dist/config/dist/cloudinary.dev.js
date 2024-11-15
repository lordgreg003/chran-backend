"use strict";

var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var cloudinary_1 = require("cloudinary");

var dotenv_1 = __importDefault(require("dotenv"));

dotenv_1["default"].config();
var _process$env = process.env,
    CLOUDINARY_CLOUD_NAME = _process$env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY = _process$env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET = _process$env.CLOUDINARY_API_SECRET;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error("Cloudinary configuration variables are missing from .env");
}

cloudinary_1.v2.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});
exports["default"] = cloudinary_1.v2;