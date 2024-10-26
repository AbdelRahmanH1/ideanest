import User from '@/DB/models/userModel.js';
import { CustomError } from '@/utils/customErrorUtils.js';
import type { Request, Response, NextFunction } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';

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

  const secretKey = process.env.TOKEN_SECRET || '';

  try {
    const payload = jwt.verify(extractedToken, secretKey) as JwtPayload;
    const userInfo = await User.findById(payload.userId);
    req.user = userInfo;

    next();
  } catch (error) {
    return next(new CustomError('Invalid Token', 401));
  }
};
