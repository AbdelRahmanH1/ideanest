import { Router } from 'express';
import { validation } from '@/middlewares/validation.js';
import * as schema from '@/schema/organizationSchema.js';
import * as controller from '@/controllers/organizationController.js';
import { authentication } from '@/middlewares/authentication.js';

const router = Router();

router.post(
  '/',
  authentication,

  validation(schema.createOrganizationSchema),
  controller.createOrganization,
);

router.put(
  '/:organization_id',
  authentication,

  validation(schema.updateOrganizationSchema),
  controller.updateOrganization,
);
router.delete(
  '/:organization_id',
  authentication,

  validation(schema.deleteOrganizationSchema),
  controller.deleteOrganizationByID,
);

export default router;
