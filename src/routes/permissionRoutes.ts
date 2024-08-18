import { Router } from 'express';
import { createPermission } from '../controllers/permission';

const router: Router = Router();

router.post('/createPermission', createPermission);

export default router;
