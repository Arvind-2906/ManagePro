import { User } from "../models/user.model.js";
import { Employee } from "../models/employee.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addEmployee = asyncHandler(async (req, res) => {
    // 1. Check permissions (assuming middleware ensures req.user exists)
    if (req.user.role !== 'admin') {
        throw new ApiError(403, "Only admins can add employees");
    }

    // 2. Extract fields
    const {
        name, email, password, role,
        employeeId, dob, gender, designation, department, salary
    } = req.body;

    if ([name, email, password, employeeId, dob, gender, designation, department, salary].some(f => f?.trim() === "")) {
        throw new ApiError(400, "Missing required fields");
    }

    // 3. User & Employee Check
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, "User email already in use");
    }

    const existingEmp = await Employee.findOne({ employeeId });
    if (existingEmp) {
        throw new ApiError(409, "Employee ID already exists");
    }

    // 4. File Upload
    let profileImageUrl = "";
    if (req.file) {
        const uploadedImage = await uploadOnCloudinary(req.file.buffer);
        if (!uploadedImage) {
            throw new ApiError(500, "Error uploading profile image");
        }
        profileImageUrl = uploadedImage.url;
    }

    // 5. Create Base User
    const userRole = role && ['admin', 'employee'].includes(role) ? role : 'employee';
    const newUser = await User.create({
        name,
        email,
        password,
        role: userRole,
        profileImage: profileImageUrl // Kept for backward compatibility if needed, or remove later
    });

    if (!newUser) throw new ApiError(500, "Failed to create User record");

    // 6. Create Relational Employee
    const newEmployee = await Employee.create({
        userId: newUser._id,
        employeeId,
        dob,
        gender,
        designation,
        department,
        salary,
        profileImage: profileImageUrl
    });

    if (!newEmployee) throw new ApiError(500, "Failed to create Employee record");

    return res.status(201).json(
        new ApiResponse(201, { user: newUser, employee: newEmployee }, "Employee created successfully")
    );
});

const getEmployeeProfile = asyncHandler(async (req, res) => {
    const employee = await Employee.findOne({ userId: req.user._id })
        .populate('userId', 'name email role profileImage')
        .populate('department', 'dep_name');

    if (!employee) {
        // Fallback to base User if this is an Admin without an employee profile
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            throw new ApiError(404, "User profile not found");
        }
        return res.status(200).json(new ApiResponse(200, { userId: user }, "User profile fetched successfully"));
    }

    return res.status(200).json(new ApiResponse(200, employee, "Profile fetched successfully"));
});

const updateEmployeeProfile = asyncHandler(async (req, res) => {
    const { name, dob, profileImage } = req.body;

    // 1. Find the employee
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) {
        throw new ApiError(404, "Employee profile not found");
    }

    // 2. Update User level details (Name, maybe Image in future)
    if (name) {
        await User.findByIdAndUpdate(req.user._id, { name });
    }

    // 3. Update Employee details (DOB)
    if (dob) {
        employee.dob = dob;
    }
    
    // 4. Update Profile Image
    if (req.file) {
        const uploadedImage = await uploadOnCloudinary(req.file.buffer);
        if (uploadedImage) {
            employee.profileImage = uploadedImage.url;
            await User.findByIdAndUpdate(req.user._id, { profileImage: uploadedImage.url });
        }
    } else if (profileImage) {
        employee.profileImage = profileImage;
    }

    await employee.save();

    // Fetch updated
    const updatedEmployee = await Employee.findOne({ userId: req.user._id })
        .populate('userId', 'name email role profileImage')
        .populate('department', 'dep_name');

    return res.status(200).json(new ApiResponse(200, updatedEmployee, "Profile updated successfully"));
});

const getAllEmployees = asyncHandler(async (req, res) => {
    const employees = await Employee.find()
        .populate('userId', 'name email role profileImage')
        .populate('department', 'dep_name');

    return res.status(200).json(new ApiResponse(200, employees, "Employees fetched successfully"));
});

const getEmployeeById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const employee = await Employee.findById(id)
        .populate('userId', 'name email role profileImage')
        .populate('department', 'dep_name');

    if (!employee) {
        throw new ApiError(404, "Employee not found");
    }

    return res.status(200).json(new ApiResponse(200, employee, "Employee fetched successfully"));
});

const editEmployee = asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin') {
        throw new ApiError(403, "Only admins can edit employees");
    }

    const { id } = req.params;
    const { name, designation, department, salary } = req.body;

    const employee = await Employee.findById(id);
    if (!employee) {
        throw new ApiError(404, "Employee not found");
    }

    if (name) {
        await User.findByIdAndUpdate(employee.userId, { name });
    }

    if (designation) employee.designation = designation;
    if (department) employee.department = department;
    if (salary) employee.salary = salary;

    await employee.save();

    const updatedEmployee = await Employee.findById(id)
        .populate('userId', 'name email role profileImage')
        .populate('department', 'dep_name');

    return res.status(200).json(new ApiResponse(200, updatedEmployee, "Employee updated successfully"));
});

const deleteEmployee = asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin') {
        throw new ApiError(403, "Only admins can delete employees");
    }

    const { id } = req.params;
    const employee = await Employee.findById(id);

    if (!employee) {
        throw new ApiError(404, "Employee not found");
    }

    // Delete the linked user
    await User.findByIdAndDelete(employee.userId);
    // Delete the employee record
    await Employee.findByIdAndDelete(id);

    return res.status(200).json(new ApiResponse(200, null, "Employee deleted successfully"));
});

export { addEmployee, getEmployeeProfile, updateEmployeeProfile, getAllEmployees, getEmployeeById, editEmployee, deleteEmployee };
