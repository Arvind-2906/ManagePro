import { Salary } from '../models/salary.model.js';
import { Employee } from '../models/employee.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Notice } from '../models/notice.model.js';
import { buildSalarySlipBuffer } from '../utils/pdfGenerator.js';

const addSalary = asyncHandler(async (req, res) => {
    const { employeeId, basicSalary, allowances, deductions, payDate } = req.body;

    if (!employeeId || !basicSalary || !payDate) {
        throw new ApiError(400, "Employee ID, Basic Salary, and Pay Date are required");
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
        throw new ApiError(404, "Employee not found");
    }

    const payDateObj = new Date(payDate);
    const existingSalary = await Salary.findOne({ 
        employeeId, 
        payDate: {
            $gte: new Date(payDateObj.getFullYear(), payDateObj.getMonth(), 1),
            $lt: new Date(payDateObj.getFullYear(), payDateObj.getMonth() + 1, 1)
        }
    });

    if (existingSalary) {
        throw new ApiError(400, "Salary record for this employee already exists for this month.");
    }

    const netSalary = Number(basicSalary) + Number(allowances || 0) - Number(deductions || 0);

    const salary = await Salary.create({
        employeeId,
        basicSalary,
        allowances: allowances || 0,
        deductions: deductions || 0,
        netSalary,
        payDate
    });

    if (salary) {
        await Notice.create({
            title: "Salary Credited",
            content: `Your salary for ${new Date(payDate).toLocaleString('default', { month: 'long', year: 'numeric' })} has been given. Net Salary: ₹${netSalary}`,
            category: "Event",
            createdBy: req.user._id,
            targetUser: employee.userId
        });
    }

    return res.status(201).json(new ApiResponse(201, salary, "Salary added successfully"));
});

const getSalaries = asyncHandler(async (req, res) => {
    const salaries = await Salary.find().populate({
        path: 'employeeId',
        select: 'employeeId designation department',
        populate: [
            { path: 'userId', select: 'name email profileImage' },
            { path: 'department', select: 'dep_name' }
        ]
    }).sort({ payDate: -1 });
    return res.status(200).json(new ApiResponse(200, salaries, "Salaries fetched successfully"));
});

const getEmployeeSalary = asyncHandler(async (req, res) => {
    // req.user contains the logged in user
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) {
        return res.status(200).json(new ApiResponse(200, [], "Employee profile not configured."));
    }
    
    const salaries = await Salary.find({ employeeId: employee._id }).sort({ payDate: -1 });
    return res.status(200).json(new ApiResponse(200, salaries, "Employee salaries fetched successfully"));
});

const generateSalarySlip = asyncHandler(async (req, res) => {
    const { id: salaryId } = req.params;

    if (!salaryId) {
        throw new ApiError(400, "Salary ID is required");
    }

    // 1. Fetch Salary and populate necessary hierarchies
    const salary = await Salary.findById(salaryId).populate({
        path: 'employeeId',
        select: 'employeeId designation department',
        populate: [
            { path: 'userId', select: 'name email profileImage' },
            { path: 'department', select: 'dep_name' }
        ]
    });

    if (!salary) {
        throw new ApiError(404, "Salary record not found");
    }

    // Authorization check to ensure an employee can't generate someone else's slip
    if (req.user.role !== 'admin' && salary.employeeId.userId._id.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized to access this slip");
    }

    // 2. Build PDF Document in Memory
    const pdfBuffer = await buildSalarySlipBuffer(salary);

    if (!pdfBuffer) {
        throw new ApiError(500, "Failed to generate PDF document");
    }

    // 3. Return PDF directly for download to avoid third-party URL access issues.
    const filename = `salary_slip_${salary.employeeId.employeeId}_${Date.now()}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    return res.status(200).send(pdfBuffer);
});

export { addSalary, getSalaries, getEmployeeSalary, generateSalarySlip };
