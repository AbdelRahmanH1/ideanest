import type { Role } from '@/enums/role.enum.js';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role?: Role;
}
