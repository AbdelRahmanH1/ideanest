import type { CustomError } from '../utils/customErrorUtils.js';
import { errorResponse } from '../utils/reponseUtils.js';
import type { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const message = err.message || 'Something went wrong';
  const statusCode = err.statusCode || 500;
  errorResponse(res, statusCode, message);
};
