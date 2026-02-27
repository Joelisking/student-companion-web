import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { PreferenceController } from '../controllers/preference.controller';
import { preferencesSchema } from '../schemas/preferences.schema';

const router = Router();
const preferenceController = new PreferenceController();

router.use(requireAuth);

router.get('/', preferenceController.getPreferences);
router.post('/', validate(preferencesSchema), preferenceController.savePreferences);
router.put('/', validate(preferencesSchema), preferenceController.updatePreferences);
router.delete('/', preferenceController.deletePreferences);

export default router;
