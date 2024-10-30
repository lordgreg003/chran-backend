import { validate, ValidationError } from "class-validator";
import { Response } from "express";

export const handleValidation = async (
  obj: any,
  reqItem: any = {},
  res: Response
): Promise<any> => {
  try {
    Object.assign(obj, reqItem);
    const errors: ValidationError[] = await validate(obj);

    if (errors.length > 0) {
      res.status(422).json({
        status: "failed",
        errors: errors.map((err) => ({
          field: err.property,
          message: err.constraints
            ? Object.values(err.constraints).join(", ")
            : "",
        })),
      });

      return errors;
    }
    return errors;
  } catch (error: any) {
    throw new Error(error);
  }
};
