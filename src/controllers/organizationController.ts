import Organization from '../DB/models/organizationModel.js';
import User from '../DB/models/userModel.js';
import { Role } from '../enums/role.enum.js';
import type { IOrganization } from '../interfaces/OrganizationInterface.js';
import asynHandler from '../utils/asyncHandler.js';
import { CustomError } from '../utils/customErrorUtils.js';
import { successResponse } from '../utils/reponseUtils.js';
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

export const getOrganizationByID = asynHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { organization_id } = req.params;
    const userId = req.user.id;

    const organization = await Organization.findById(organization_id).populate(
      'members.user',
      'name email',
    );

    if (!organization) {
      return next(new CustomError('Organization not found', 404));
    }

    const isOwner = organization.createdBy.toString() === userId;

    const member = organization.members.find(
      (member) => member.user.toString() === userId,
    );

    if (!isOwner && !member) {
      return next(
        new CustomError(
          'Access denied. You are not authorized to view this organization.',
          403,
        ),
      );
    }
    const responseResult = {
      organization_id: organization._id,
      name: organization.name,
      description: organization.description,
      organization_members: organization.members.map((member) => ({
        name: member.user.name,
        email: member.user.email,
        access_level: member.accessLevel,
      })),
    };
    return successResponse(res, 200, null, responseResult);
  },
);

export const getAllOrganizations = asynHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;

    const organizations = await Organization.find({
      $or: [{ createdBy: userId }, { 'members.user': userId }],
    }).populate('members.user', 'name email');

    const responseResult = organizations.map((org) => ({
      organization_id: org._id.toString(),
      name: org.name,
      description: org.description,
      organization_members: org.members.map((member) => ({
        name: member.user.name,
        email: member.user.email,
        access_level: member.accessLevel,
      })),
    }));

    return res.status(200).json(responseResult);
  },
);

export const inviteToOrganization = asynHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { organization_id } = req.params;
    const { user_email } = req.body;
    const userId = req.user.id;

    const existingOrganization = await Organization.findById(organization_id);
    if (!existingOrganization) {
      return next(new CustomError('Organization does not exist', 404));
    }

    const isOwner = existingOrganization.createdBy.toString() === userId;
    const isAdmin = existingOrganization.members.some((member) => {
      return (
        member.user.toString() === userId && member.accessLevel === 'admin'
      );
    });
    if (!isOwner && !isAdmin) {
      return next(
        new CustomError(
          'You must be an admin or the owner to invite users.',
          403,
        ),
      );
    }

    const userToInvite = await User.findOne({ email: user_email });
    if (!userToInvite) {
      return next(new CustomError('User does not exist', 404));
    }
    const isAlreadyMember = existingOrganization.members.some(
      (member) => member.user.toString() === userToInvite._id.toString(),
    );
    if (isAlreadyMember) {
      return next(
        new CustomError('User is already a member of the organization', 400),
      );
    }
    existingOrganization.members.push({
      user: userToInvite.id,
      accessLevel: Role.READONLY,
    });
    await existingOrganization.save();

    //send email to the user
    return successResponse(res, 200, 'User invited successfully');
  },
);
