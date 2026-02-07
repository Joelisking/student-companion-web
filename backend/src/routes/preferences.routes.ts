import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { PreferenceController } from '../controllers/preference.controller';

const router = Router();
const preferenceController = new PreferenceController();

router.use(requireAuth);

router.get('/', preferenceController.getPreferences);
router.post('/', preferenceController.savePreferences);
router.put('/', preferenceController.updatePreferences);
router.delete('/', preferenceController.deletePreferences);

export default router;
