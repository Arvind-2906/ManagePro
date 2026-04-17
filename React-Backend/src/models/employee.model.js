import mongoose, { Schema } from "mongoose";

const employeeSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    employeeId: {
        type: String,
        required: true,
        unique: true
    },
    dob: {
        type: Date
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other", "Pending"],
        default: "Pending"
    },
    designation: {
        type: String
    },
    department: {
        type: Schema.Types.ObjectId,
        ref: "Department"
    },
    salary: {
        type: Number,
        default: 0
    },
    profileImage: {
        type: String, // Cloudinary URL
        default: ""
    }
}, { timestamps: true });

export const Employee = mongoose.model("Employee", employeeSchema);
