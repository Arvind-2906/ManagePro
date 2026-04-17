import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Notice } from "../models/notice.model.js";

// @desc    Post a new announcement
// @route   POST /api/v1/notice
// @access  Admin/Private
export const createNotice = asyncHandler(async (req, res) => {
    const { title, content, category } = req.body;

    if ([title, content].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Title and content are required");
    }

    const notice = await Notice.create({
        title,
        content,
        category: category || "General",
        createdBy: req.user._id
    });

    if (!notice) {
        throw new ApiError(500, "Something went wrong while creating the notice");
    }

    return res.status(201).json(
        new ApiResponse(201, notice, "Notice created successfully")
    );
});

// @desc    Fetch all notices for the dashboard
// @route   GET /api/v1/notice
// @access  Private
export const getAllNotices = asyncHandler(async (req, res) => {
    let query = {};
    if (req.user && req.user.role === 'employee') {
        query = {
            $or: [
                { targetUser: null },
                { targetUser: req.user._id }
            ]
        };
    }

    const notices = await Notice.find(query)
        .populate("createdBy", "name")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, notices, "Notices retrieved successfully")
    );
});
