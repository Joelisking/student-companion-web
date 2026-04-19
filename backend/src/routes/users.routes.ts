import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { UserController } from '../controllers/user.controller';
import { updateProfileSchema, changePasswordSchema } from '../schemas/user.schema';

const router = Router();
const userController = new UserController();

router.use(requireAuth);

router.get('/me', userController.getProfile);
router.put('/me', validate(updateProfileSchema), userController.updateProfile);
router.put('/me/password', validate(changePasswordSchema), userController.changePassword);

export default router;
