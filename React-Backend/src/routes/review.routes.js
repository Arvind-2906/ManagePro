import express from "express";
import { addReview, getEmployeeReviews } from "../controllers/review.controller.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyJWT);

router.route("/:employeeId").get(getEmployeeReviews);
router.route("/").post(isAdmin, addReview);

export default router;
