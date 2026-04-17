import { Department } from "../models/department.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addDepartment = asyncHandler(async (req, res) => {
    // Note: Assuming middleware verified user is an Admin
    const { dep_name, description } = req.body;

    if (!dep_name || dep_name.trim() === "") {
        throw new ApiError(400, "Department name is required");
    }

    const existedDept = await Department.findOne({ dep_name: dep_name.toLowerCase() });

    if (existedDept) {
        throw new ApiError(409, "Department already exists");
    }

    const newDepartment = await Department.create({
        dep_name,
        description: description || ""
    });

    if (!newDepartment) {
        throw new ApiError(500, "Failed to create department");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, newDepartment, "Department created successfully"));
});

const getAllDepartments = asyncHandler(async (req, res) => {
    const departments = await Department.find({});

    if (!departments) {
        throw new ApiError(500, "Failed to fetch departments");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, departments, "Departments fetched successfully"));
});

export { addDepartment, getAllDepartments };
