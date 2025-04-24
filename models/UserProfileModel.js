import mongoose from "mongoose";

const UserProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            unique: true,
            required: true
        },
        categoryPreference: {
            type: Map,
            of: Number,
            default: {},
        },
        difficultyPreference: {
            type: Map,
            of: Number,
            default: {},
        },
        recentInteractedQuestions: {
            type: [mongoose.Types.ObjectId],
            default: [],
        },
    }, { timestamps: true }
);

export default mongoose.model("UserProfile", UserProfileSchema);
