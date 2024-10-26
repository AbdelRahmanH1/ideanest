import asynHandler from '@/utils/asyncHandler.js';
import type { Request, Response, NextFunction } from 'express';

export const createOrganization = asynHandler(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const getOrganizationByID = asynHandler(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const getAllOrganizations = asynHandler(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const updateOrganization = asynHandler(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const deleteOrganizationByID = asynHandler(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const inviteToOrganization = asynHandler(
  async (req: Request, res: Response, next: NextFunction) => {},
);
