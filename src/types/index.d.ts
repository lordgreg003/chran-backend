// types/express/index.d.ts
import * as multer from "multer";
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      files?: {
        image?: multer.File[];
        video?: multer.File[];
      };
    }
  }
}
