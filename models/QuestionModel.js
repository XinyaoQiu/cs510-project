import mongoose from 'mongoose';
import { QUESTION_CATEGORIES, QUESTION_DIFFICULTIES } from '../utils/constants.js';

const QuestionSchema = new mongoose.Schema(
    {
        title: String,
        question: String,
        company: String,
        category: {
            type: String,
            enum: Object.values(QUESTION_CATEGORIES),
            default: QUESTION_CATEGORIES.OTHER,
        },
        difficulty: {
            type: String,
            enum: Object.values(QUESTION_DIFFICULTIES),
            default: QUESTION_DIFFICULTIES.EASY,
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
)

export default mongoose.model('Question', QuestionSchema);