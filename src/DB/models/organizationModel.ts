import type { IOrganization } from '@/interfaces/OrganizationInterface.js';
import { model, Schema } from 'mongoose';

const organizationSchema = new Schema<IOrganization>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

const Organization = model('Organization', organizationSchema);
export default Organization;
