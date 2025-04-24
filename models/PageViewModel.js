import mongoose from 'mongoose';

const PageViewSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        questionId: {
            type: mongoose.Types.ObjectId,
            ref: 'Question',
            required: true
        },

    }, { timestamps: true }
);

export default mongoose.model('PageView', PageViewSchema);
