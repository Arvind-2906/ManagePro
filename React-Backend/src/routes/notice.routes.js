import express from "express";
import { createNotice, getAllNotices } from "../controllers/notice.controller.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyJWT); // Apply verifyJWT to all routes in this file

router.route("/").get(getAllNotices);
router.route("/").post(isAdmin, createNotice);

export default router;
