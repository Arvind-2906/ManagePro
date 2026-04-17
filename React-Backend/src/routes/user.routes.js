import { Router } from 'express';
import { registerEmployee, updateProfile } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT, isAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Protect all routes
router.use(verifyJWT);

// Admin-only route for creating new employees
// (Assuming verifyJWT or a check handles role verification. Let's add basic role check in controller or here if needed. 
// For now, user requirements say "registerEmployee function (Admin only) that uses asyncHandler", 
// we will assume the verifyJWT places req.user and the frontend handles access, 
// but we'll add a quick Admin check optionally or trust the verifyJWT + frontend for now.)
router.route('/add-employee').post(
    isAdmin,
    upload.single('profileImage'),
    registerEmployee
);

router.route('/update-profile').patch(
    upload.single('profileImage'),
    updateProfile
);

export default router;
