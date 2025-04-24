import mongoose from "mongoose";

const BookmarkSchema = new mongoose.Schema(
    {
        itemType: {
            type: String,
            required: true,
            enum: ['Question', 'Answer'],
        },
        itemId: {
            type: mongoose.Types.ObjectId,
            required: true,
            refPath: 'itemType',
        },
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        value: {
            type: Number,
            required: true,
            enum: [1, 0]
        }
    },
    { timestamps: true }
);

BookmarkSchema.index({ itemType: 1, item: 1, user: 1 }, { unique: true });

export default mongoose.model("Bookmark", BookmarkSchema);