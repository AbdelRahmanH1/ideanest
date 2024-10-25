import type { Request, Response, NextFunction } from 'express';
import { CustomError } from './customErrorUtils.js';

const asynHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((e: Error) => {
      return next(new CustomError(e.message, 500));
    });
  };
};
export default asynHandler;
