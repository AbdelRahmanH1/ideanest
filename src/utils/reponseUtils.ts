import type { Response } from 'express';

export const successResponse = (
  res: Response,
  status: number = 200,
  message?: string | null,
  data?: any | null,
) => {
  const response: any = {};

  if (message) {
    response.message = message;
  }

  if (data) {
    Object.assign(response, data);
  }

  return res.status(status).json(response);
};
export const errorResponse = (res: Response, status: number, error: string) => {
  return res.status(status).json({ success: false, error });
};
