import type { Role } from '../enums/role.enum.js';
import type { IUser } from './UserInterface.js';

export interface IOrganizationMember {
  user: IUser;
  accessLevel: Role;
}
