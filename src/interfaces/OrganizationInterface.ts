import type { Types } from 'mongoose';

export interface IOrganization {
  _id?: string;
  name: string;
  description?: string;
  createdBy: Types.ObjectId;
  members: Types.ObjectId[];
}
