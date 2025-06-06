import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema(
    {
        text: String,
        questionId: {
            type: mongoose.Types.ObjectId,
            ref: 'Question',
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    }, 
    { timestamps: true }
);

AnswerSchema.index({ questionId: 1 });

export default mongoose.model('Answer', AnswerSchema);