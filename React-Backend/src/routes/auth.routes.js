import { Router } from 'express';
import { registerUser, loginUser, verifyUser as verifySession } from '../controllers/auth.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/verify').get(verifyJWT, verifySession);

export default router;
