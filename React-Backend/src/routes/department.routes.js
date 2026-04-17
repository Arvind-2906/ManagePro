import { Router } from 'express';
import { addDepartment, getAllDepartments } from '../controllers/department.controller.js';
import { verifyJWT, isAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Protect all routes
router.use(verifyJWT);

router.route('/add').post(isAdmin, addDepartment);
router.route('/').get(getAllDepartments);

export default router;
