import { CustomError } from '@/utils/customErrorUtils.js';
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token: string | undefined = req.headers.authorization;

  if (!token) {
    return next(new CustomError('Authorization header missing', 401));
  }

  const BEARER_KEY = process.env.BEARER_KEY || '';

  if (!token.startsWith(BEARER_KEY)) {
    return next(new CustomError('Token not valid', 400));
  }

  const extractedToken = token.split(BEARER_KEY)[1]?.trim();
  if (!extractedToken) {
    return next(new CustomError('Token missing', 401));
  }

  const secretKey = process.env.SECRET_KEY || '';

  try {
    const payload = jwt.verify(extractedToken, secretKey);
    req.user = payload;
    next();
  } catch (error) {
    return next(new CustomError('Invalid Token', 401));
  }
};
