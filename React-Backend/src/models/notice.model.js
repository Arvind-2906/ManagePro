import mongoose, { Schema } from "mongoose";

const noticeSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ["Holiday", "Policy", "Event", "General"],
        default: "General"
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    targetUser: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null
    }
}, { timestamps: true });

export const Notice = mongoose.model("Notice", noticeSchema);
