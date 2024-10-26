import { Router } from 'express';
import { validation } from '@/middlewares/validation.js';
import * as controller from '@/controllers/organizationController.js';
const router = Router();

router.post('/', controller.createOrganization);
router.get('/:organization_id', controller.getOrganizationByID);
router.get('/', controller.getAllOrganizations);
router.put('/', controller.updateOrganization);
router.delete('/:organization_id', controller.deleteOrganizationByID);
router.post('/:organization_id/invite', controller.inviteToOrganization);
export default router;
