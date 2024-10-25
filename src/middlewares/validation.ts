import type { ObjectSchema } from 'joi';
import type { Request, Response, NextFunction } from 'express';
import { CustomError } from '@/utils/customErrorUtils.js';
import { Types } from 'mongoose';

export const validation = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = { ...req.body, ...req.params, ...req.query };
    const { error } = schema.validate(data, { abortEarly: false });

    if (error) {
      const messages = error.details.map((errorObj) => {
        return errorObj.message;
      });
      return next(new CustomError(messages, 404));
    }
    next();
  };
};
export const isValidObjectId = (value: any, helper: any) => {
  if (!Types.ObjectId.isValid(value))
    return helper.message('Invalid Object Id');
  return value;
};
