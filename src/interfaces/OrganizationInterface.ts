import type { Types } from 'mongoose';
import type { IOrganizationMember } from './IOrganizationMemberInterface.js';

export interface IOrganization {
  organization_id?: string;
  name: string;
  description?: string;
  createdBy: Types.ObjectId;
  members: IOrganizationMember[];
}
