import Organization from '@/DB/models/organizationModel.js';
import User from '@/DB/models/userModel.js';
import { Role } from '@/enums/role.enum.js';
import type { IOrganization } from '@/interfaces/OrganizationInterface.js';
import asynHandler from '@/utils/asyncHandler.js';
import { CustomError } from '@/utils/customErrorUtils.js';
import { successResponse } from '@/utils/reponseUtils.js';
import type { Request, Response, NextFunction } from 'express';

export const createOrganization = asynHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description } = req.body as IOrganization;

    const existingOrganization = await Organization.findOne({ name });
    if (existingOrganization) {
      return next(new CustomError('Organization already exists', 400));
    }

    const newOrganization = new Organization({
      name,
      description,
      createdBy: req.user._id,
    });
    newOrganization.save();
    return successResponse(res, 201, null, {
      organization_id: newOrganization.id,
    });
  },
);

export const updateOrganization = asynHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description } = req.body;
    const { organization_id } = req.params;

    const existingOrganization = await Organization.findById(organization_id);
    if (!existingOrganization) {
      return next(new CustomError('Organization does not exist', 404));
    }

    if (existingOrganization.createdBy.toString() !== req.user._id.toString()) {
      return next(
        new CustomError(
          'Access denied: Only the creator can update the organization',
          403,
        ),
      );
    }

    existingOrganization.name = name ? name : existingOrganization.name;
    existingOrganization.description = description
      ? description
      : existingOrganization.description;

    const updateOrganization = await existingOrganization.save();

    return successResponse(res, 200, null, {
      organization_id: updateOrganization.id,
      name: updateOrganization.name,
      description: updateOrganization.description,
    });
  },
);

export const deleteOrganizationByID = asynHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { organization_id } = req.params;

    const existingOrganization = await Organization.findById(organization_id);
    if (!existingOrganization) {
      return next(new CustomError('Organization does not exist', 404));
    }

    if (existingOrganization.createdBy.toString() !== req.user._id.toString()) {
      return next(
        new CustomError(
          'Access denied: Only the creator can delete the organization',
          403,
        ),
      );
    }
    await existingOrganization.deleteOne();

    return successResponse(
      res,
      200,
      `Organization "${existingOrganization.name}" deleted successfully`,
    );
  },
);
