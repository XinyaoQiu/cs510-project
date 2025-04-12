import { Router } from 'express';
import {
    getQuestions,
    createQuestion,
    getQuestion,
    updateQuestion,
    deleteQuestion,
} from '../controllers/questionController.js';
import {
    validateQuestionInput,
    validateIdParam,
} from '../middleware/validationMiddleware.js';
import { checkForTestUser } from '../middleware/authMiddleware.js';

const router = Router();

router
    .route('/')
    .get(getQuestions)
    .post(checkForTestUser, validateQuestionInput, createQuestion);

router
    .route('/:id')
    .get(validateIdParam, getQuestion)
    .patch(checkForTestUser, validateQuestionInput, validateIdParam, updateQuestion)
    .delete(checkForTestUser, validateIdParam, deleteQuestion);

export default router;