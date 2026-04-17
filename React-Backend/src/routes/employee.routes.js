import { Router } from 'express';
import { addEmployee, getEmployeeProfile, updateEmployeeProfile, getAllEmployees, getEmployeeById, editEmployee, deleteEmployee } from '../controllers/employee.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT, isAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Protect all routes
router.use(verifyJWT);

// Employee Profile routes
router.route('/profile')
    .get(getEmployeeProfile)
    .put(upload.single('profileImage'), updateEmployeeProfile);

// Create route (handles multipart form data via multer)
router.route('/add').post(
    upload.single('profileImage'),
    addEmployee
);

// Read routes
router.route('/all')
    .get(isAdmin, getAllEmployees);

router.route('/:id')
    .get(getEmployeeById)
    .put(editEmployee)
    .delete(deleteEmployee);

export default router;
