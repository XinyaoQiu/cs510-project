import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
            trim: true,
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        parentType: {
            type: String,
            required: true,
            enum: ['Question', 'Answer'],
        },
        parentId: {
            type: mongoose.Types.ObjectId,
            required: true,
            refPath: 'parentType',
        },
    },
    { timestamps: true }
);

CommentSchema.index({ parentId: 1, parentType: 1 });

export default mongoose.model('Comment', CommentSchema);