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
} from '../middleware/validationMiddleware.js';
import { checkForTestUser } from '../middleware/authMiddleware.js';

const router = Router();

router
    .route('/')
    .get(getAllQuestions)
    .post(checkForTestUser, validateQuestionInput, createQuestion);

router
    .route('/:id')
    .get(validateQuestionIdParam, getQuestion)
    .patch(checkForTestUser, validateQuestionInput, validateQuestionIdParam, updateQuestion)
    .delete(checkForTestUser, validateQuestionIdParam, deleteQuestion);

export default router;