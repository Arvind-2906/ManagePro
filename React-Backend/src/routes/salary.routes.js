import { Router } from 'express';
import { addSalary, getSalaries, getEmployeeSalary, generateSalarySlip } from '../controllers/salary.controller.js';
import { verifyJWT, isAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJWT); // Secure all salary routes

router.route('/').get(isAdmin, getSalaries).post(isAdmin, addSalary);
router.route('/employee').get(getEmployeeSalary);
router.route('/generate-slip/:id').get(generateSalarySlip); // Allows downloading by specific ID

export default router;
