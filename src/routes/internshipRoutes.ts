import { Router } from 'express';
const router: Router = Router();

import {
    createInternship,
    getInternshipByID,
    getInternships,
    updateInternship,
} from '../controllers/internship';

import { authorize } from '../middleware/auth_user';

router.post(
    '/createInternship',
    authorize(['create_internship']),
    createInternship
);
router.get(
    '/getInternships',
    authorize(['get_all_internship']),
    getInternships
);
router.get(
    '/getInternship/:id',
    authorize(['get_internship_by_id']),
    getInternshipByID
);
router.put(
    '/updateInternship/:id',
    authorize(['update_internship']),
    updateInternship
);

export default router;
