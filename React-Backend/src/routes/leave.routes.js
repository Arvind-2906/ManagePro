import { Router } from 'express';
import { applyLeave, getLeaves, getEmployeeLeaves, updateLeaveStatus } from '../controllers/leave.controller.js';
import { verifyJWT, isAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJWT); // Secure all leave routes

router.route('/').get(isAdmin, getLeaves).post(applyLeave);
router.route('/employee').get(getEmployeeLeaves);
router.route('/:leaveId').patch(isAdmin, updateLeaveStatus);

export default router;
