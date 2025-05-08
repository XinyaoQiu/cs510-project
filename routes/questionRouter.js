import { Router } from 'express';
import {
    getAllQuestions,
    createQuestion,
    getQuestion,
    updateQuestion,
    deleteQuestion,
} from '../controllers/questionController.js';
import {
    validateQuestionInput,
    validateQuestionIdParam,
    validateQuestionUser,
} from '../middleware/validationMiddleware.js';

const router = Router();

router
    .route('/')
    .get(getAllQuestions)
    .post(validateQuestionInput, createQuestion);

router
    .route('/:id')
    .get(validateQuestionIdParam, getQuestion)
    .patch(validateQuestionInput, validateQuestionIdParam, validateQuestionUser, updateQuestion)
    .delete(validateQuestionIdParam, validateQuestionUser, deleteQuestion);

export default router;