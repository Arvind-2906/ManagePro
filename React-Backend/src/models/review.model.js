import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema({
    employeeId: {
        type: Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },
    reviewerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comments: {
        type: String,
        required: false
    },
    reviewDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export const Review = mongoose.model("Review", reviewSchema);
