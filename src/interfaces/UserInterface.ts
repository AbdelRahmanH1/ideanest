import type { Role } from '@/enums/role.enum.js';
import type { Types } from 'mongoose';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role?: Role;
  organizations: Types.ObjectId[];
}
