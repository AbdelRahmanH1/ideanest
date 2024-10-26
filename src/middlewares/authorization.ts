import type { Request, Response, NextFunction } from 'express';
import { CustomError } from '@/utils/customErrorUtils.js';
import { Role } from '@/enums/role.enum.js';

export const authorizeRoles = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role as Role;

    if (!allowedRoles.includes(userRole)) {
      return next(
        new CustomError('Access denied: Insufficient permissions', 403),
      );
    }

    next();
  };
};
