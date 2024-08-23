import { Router } from 'express';
import { createRole, getRoles } from '../controllers/roles';
import { addPermissionToRole } from '../controllers/permission';

const router: Router = Router();

router.post('/createRole', createRole);

router.post('/roles/:_id/permissions', addPermissionToRole);
router.get('/roles', getRoles);
export default router;
