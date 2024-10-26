import Joi from 'joi';
import type { IOrganization } from '../interfaces/OrganizationInterface.js';
import { isValidObjectId } from 'mongoose';

export const createOrganizationSchema = Joi.object<IOrganization>({
  name: Joi.string().required(),
  description: Joi.string().required(),
}).required();

export const updateOrganizationSchema = Joi.object<IOrganization>({
  organization_id: Joi.string().custom(isValidObjectId).required(),
  name: Joi.string(),
  description: Joi.string(),
}).required();

export const deleteOrganizationSchema = Joi.object<IOrganization>({
  organization_id: Joi.string().custom(isValidObjectId).required(),
}).required();

export const inviteToOrganizationSchema = Joi.object({
  organization_id: Joi.string().custom(isValidObjectId).required(),
  user_email: Joi.string().email().required(),
}).required();

export const getOrganizationByIDSchema = Joi.object<IOrganization>({
  organization_id: Joi.string().custom(isValidObjectId).required(),
}).required();
