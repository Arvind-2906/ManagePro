import { Leave } from '../models/leave.model.js';
import { Employee } from '../models/employee.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Notice } from '../models/notice.model.js';

const applyLeave = asyncHandler(async (req, res) => {
    const { leaveType, startDate, endDate, reason } = req.body;

    if (!leaveType || !startDate || !endDate || !reason) {
        throw new ApiError(400, "All fields are required");
    }

    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) {
        throw new ApiError(404, "Employee profile not found");
    }

    const leave = await Leave.create({
        employeeId: employee._id,
        leaveType,
        startDate,
        endDate,
        reason
    });

    return res.status(201).json(new ApiResponse(201, leave, "Leave applied successfully"));
});

const getLeaves = asyncHandler(async (req, res) => {
    const leaves = await Leave.find().populate({
        path: 'employeeId',
        select: 'employeeId designation department',
        populate: [
            { path: 'userId', select: 'name email profileImage' },
            { path: 'department', select: 'dep_name' }
        ]
    }).sort({ appliedDate: -1 });
    
    return res.status(200).json(new ApiResponse(200, leaves, "All leaves fetched successfully"));
});

const getEmployeeLeaves = asyncHandler(async (req, res) => {
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) {
        return res.status(200).json(new ApiResponse(200, [], "Employee profile not configured."));
    }

    const leaves = await Leave.find({ employeeId: employee._id }).sort({ appliedDate: -1 });
    return res.status(200).json(new ApiResponse(200, leaves, "Employee leaves fetched successfully"));
});

const updateLeaveStatus = asyncHandler(async (req, res) => {
    const { leaveId } = req.params;
    const { status } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
        throw new ApiError(400, "Invalid status");
    }

    const leave = await Leave.findByIdAndUpdate(leaveId, { status }, { new: true }).populate("employeeId");
    if (!leave) {
        throw new ApiError(404, "Leave not found");
    }

    if (leave) {
        await Notice.create({
            title: `Leave Request ${status}`,
            content: `Your leave request from ${new Date(leave.startDate).toLocaleDateString()} to ${new Date(leave.endDate).toLocaleDateString()} has been ${status.toLowerCase()}.`,
            category: "Event",
            createdBy: req.user._id,
            targetUser: leave.employeeId.userId
        });
    }

    return res.status(200).json(new ApiResponse(200, leave, `Leave ${status.toLowerCase()} successfully`));
});

export { applyLeave, getLeaves, getEmployeeLeaves, updateLeaveStatus };
