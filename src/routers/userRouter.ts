import { Router } from 'express';
import * as controller from '@/controllers/userController.js';
import * as schema from '@/schema/userSchema.js';
import { validation } from '@/middlewares/validation.js';

const router = Router();

router.post('/signup', validation(schema.signUpSchema), controller.signUp);
router.post('/signin', validation(schema.signInSchema), controller.signIn);
router.post(
  '/refresh-token',
  validation(schema.refreshTokenSchema),
  controller.refreshToken,
);
router.post(
  '/revoke-refresh-token',
  validation(schema.refreshTokenSchema),
  controller.revokeRefreshToken,
);
export default router;
