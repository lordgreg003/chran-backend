import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import path from "path";

// Configure dotenv to load the .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const errorMiddleware: any = {};

errorMiddleware.notFound = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error: any = new Error(`Not Found - ${req.originalUrl} is invalid`);
  res.status(404);
  next(error);
};

errorMiddleware.errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.error(err.stack);
  const statusCode: number = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    code: statusCode,
    message: err.message,
    env: process.env.NODE_ENV,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
  next();
};

export default errorMiddleware;
