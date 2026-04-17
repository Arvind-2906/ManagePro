import mongoose, { Schema } from "mongoose";

const salarySchema = new Schema({
    employeeId: {
        type: Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },
    basicSalary: {
        type: Number,
        required: true
    },
    allowances: {
        type: Number,
        default: 0
    },
    deductions: {
        type: Number,
        default: 0
    },
    netSalary: {
        type: Number,
        required: true
    },
    payDate: {
        type: Date,
        required: true
    }
}, { timestamps: true });

export const Salary = mongoose.model("Salary", salarySchema);
