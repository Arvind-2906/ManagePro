import mongoose, { Schema } from "mongoose";

const departmentSchema = new Schema({
    dep_name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

export const Department = mongoose.model("Department", departmentSchema);
