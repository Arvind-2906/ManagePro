import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { Employee } from '../models/employee.model.js';
import { Department } from '../models/department.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import mongoose from 'mongoose';

const registerEmployee = asyncHandler(async (req, res) => {
    // Admin only check is handled by middleware
    const {
        name,
        email,
        role,
        employeeId,
        dob,
        gender,
        designation,
        department,
        salary,
        removeProfileImage
    } = req.body;
    const shouldRemoveProfileImage = removeProfileImage === true || removeProfileImage === 'true';

    if ([name, email].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "Name and email are required");
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedEmployeeId = employeeId?.trim();

    const existedUser = await User.findOne({ email: normalizedEmail });

    if (!existedUser) {
        throw new ApiError(404, "User not found. Ask employee to register first and set their own password.");
    }

    let profileImageBuffer;
    if (req.file) {
        profileImageBuffer = req.file.buffer;
    }

    let profileImage;
    if (profileImageBuffer) {
        profileImage = await uploadOnCloudinary(profileImageBuffer);
        if (!profileImage) {
            throw new ApiError(500, "Error while uploading profile image to cloud");
        }
    }

    let departmentId;
    if (department && department.trim() !== "") {
        if (mongoose.Types.ObjectId.isValid(department)) {
            const deptById = await Department.findById(department);
            if (!deptById) {
                throw new ApiError(404, "Department not found");
            }
            departmentId = deptById._id;
        } else {
            const deptByName = await Department.findOne({ dep_name: department.toLowerCase().trim() });
            if (!deptByName) {
                throw new ApiError(404, "Department not found");
            }
            departmentId = deptByName._id;
        }
    }

    existedUser.name = name.trim();
    existedUser.role = role && ['admin', 'employee'].includes(role) ? role : 'employee';
    if (profileImage?.url) {
        existedUser.profileImage = profileImage.url;
    } else if (shouldRemoveProfileImage) {
        existedUser.profileImage = "";
    }
    await existedUser.save({ validateBeforeSave: false });

    let employeeDoc = await Employee.findOne({ userId: existedUser._id });

    if (employeeDoc) {
        // Update existing employee profile using provided fields.
        if (normalizedEmployeeId && normalizedEmployeeId !== employeeDoc.employeeId) {
            const duplicateEmployeeId = await Employee.findOne({
                employeeId: normalizedEmployeeId,
                _id: { $ne: employeeDoc._id }
            });

            if (duplicateEmployeeId) {
                throw new ApiError(409, "Employee ID already exists");
            }

            employeeDoc.employeeId = normalizedEmployeeId;
        }

        if (dob) employeeDoc.dob = dob;
        if (gender && gender.trim() !== "") employeeDoc.gender = gender;
        if (designation && designation.trim() !== "") employeeDoc.designation = designation;
        if (departmentId) employeeDoc.department = departmentId;
        if (salary !== undefined && salary !== "") employeeDoc.salary = Number(salary);
        if (profileImage?.url) {
            employeeDoc.profileImage = profileImage.url;
        } else if (shouldRemoveProfileImage) {
            employeeDoc.profileImage = "";
        } else if (!employeeDoc.profileImage && existedUser.profileImage) {
            employeeDoc.profileImage = existedUser.profileImage;
        }

        await employeeDoc.save();

        const updatedUser = await User.findById(existedUser._id).select("-password");
        const updatedEmployee = await Employee.findById(employeeDoc._id)
            .populate('department', 'dep_name')
            .populate('userId', 'name email role profileImage');

        return res
            .status(200)
            .json(new ApiResponse(200, { user: updatedUser, employee: updatedEmployee }, "Employee profile updated successfully"));
    }

    if (!normalizedEmployeeId) {
        throw new ApiError(400, "Employee ID is required to create a new employee profile");
    }

    const existingEmpId = await Employee.findOne({ employeeId: normalizedEmployeeId });
    if (existingEmpId) {
        throw new ApiError(409, "Employee ID already exists");
    }

    employeeDoc = await Employee.create({
        userId: existedUser._id,
        employeeId: normalizedEmployeeId,
        dob: dob || undefined,
        gender: gender || undefined,
        designation: designation || undefined,
        department: departmentId,
        salary: salary ? Number(salary) : 0,
        profileImage: profileImage?.url || existedUser.profileImage || ""
    });

    const createdUser = await User.findById(existedUser._id).select("-password");
    const createdEmployee = await Employee.findById(employeeDoc._id)
        .populate('department', 'dep_name')
        .populate('userId', 'name email role profileImage');

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while preparing employee profile");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, { user: createdUser, employee: createdEmployee }, "Employee profile created successfully"));
});

const updateProfile = asyncHandler(async (req, res) => {
    const { name, age, designation, department, removeProfileImage } = req.body;
    const shouldRemoveProfileImage = removeProfileImage === true || removeProfileImage === 'true';

    // 1. Find User and Employee linked to the current logged-in user
    const user = await User.findById(req.user._id);
    let employee = await Employee.findOne({ userId: req.user._id });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (!employee && user.role !== 'admin') {
        const timestamp = Date.now().toString().slice(-6);
        employee = await Employee.create({
            userId: user._id,
            employeeId: `EMP-${timestamp}`,
            salary: 0
        });
    }

    // 2. Update User details (Name)
    if (name) {
        user.name = name;
        await user.save({ validateBeforeSave: false });
    }

    // 3. Update Employee details (Age/DOB, Designation, and Department) if employee exists
    if (employee) {
        if (age) {
            const currentYear = new Date().getFullYear();
            employee.dob = new Date(`${currentYear - age}-01-01`);
        }
        if (designation) {
            employee.designation = designation;
        }
        if (department) {
            employee.department = department; // ObjectId reference
        }
    }

    // 4. Handle Cloudinary Image Upload
    const profileImageBuffer = req.file?.buffer;

    if (profileImageBuffer) {
        const uploadedImage = await uploadOnCloudinary(profileImageBuffer);

        if (!uploadedImage || !uploadedImage.url) {
            throw new ApiError(400, "Error while uploading profile image");
        }

        user.profileImage = uploadedImage.url;
        await user.save({ validateBeforeSave: false });

        if (employee) {
            employee.profileImage = uploadedImage.url;
        }
    } else if (shouldRemoveProfileImage) {
        user.profileImage = "";
        await user.save({ validateBeforeSave: false });

        if (employee) {
            employee.profileImage = "";
        }
    }

    if (employee) {
        await employee.save();
    }

    // 5. Fetch updated data
    const updatedData = employee
        ? await Employee.findOne({ userId: req.user._id })
            .populate("userId", "name email role profileImage")
            .populate("department", "dep_name")
        : { userId: await User.findById(req.user._id).select("-password") };

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedData, "Profile updated successfully")
        );
});

export { registerEmployee, updateProfile };
