import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/custom-error";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof CustomError) {
    res.status(error.statusCode).send({ errors: error.serializeErrors() });
  } else {
    res.status(500).send({
      errors: [{ message: "Something went wrong..." }],
    });
  }
};
