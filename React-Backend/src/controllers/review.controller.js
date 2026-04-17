import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Review } from "../models/review.model.js";

// @desc    Submit a rating and comment for an employee
// @route   POST /api/v1/review
// @access  Admin/Private
export const addReview = asyncHandler(async (req, res) => {
    const { employeeId, rating, comments } = req.body;

    if (!employeeId || !rating) {
        throw new ApiError(400, "Employee ID and rating are required");
    }

    if (rating < 1 || rating > 5) {
        throw new ApiError(400, "Rating must be between 1 and 5");
    }

    const review = await Review.create({
        employeeId,
        reviewerId: req.user._id,
        rating,
        comments
    });

    if (!review) {
        throw new ApiError(500, "Something went wrong while creating the review");
    }

    return res.status(201).json(
        new ApiResponse(201, review, "Review added successfully")
    );
});

// @desc    Fetch the last 6 months of reviews for a specific employee
// @route   GET /api/v1/review/:employeeId
// @access  Private
export const getEmployeeReviews = asyncHandler(async (req, res) => {
    const { employeeId } = req.params;

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const reviews = await Review.find({ 
        employeeId,
        reviewDate: { $gte: sixMonthsAgo } 
    }).sort({ reviewDate: 1 });

    // Format for recharts, grouped by month/year
    const formattedReviews = reviews.map(r => ({
        month: r.reviewDate.toLocaleString('default', { month: 'short' }),
        rating: r.rating,
        comments: r.comments,
        date: r.reviewDate
    }));

    // If there are multiple reviews in a month we might want to average them or just return them linearly
    return res.status(200).json(
        new ApiResponse(200, formattedReviews, "Employee reviews retrieved successfully")
    );
});
