import { Response } from "express";

const responseHandle: any = {};

responseHandle.successResponse = (
  res: Response,
  status: number,
  message: string,
  data: any
) => {
  return res.status(Number(status)).json({
    status: "success",
    message,
    data,
  });
};

export default responseHandle;
