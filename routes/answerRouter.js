import { Router } from 'express';
import {
    getAllAnswers,
    createAnswer,
    getAnswer,
    updateAnswer,
    deleteAnswer,
} from '../controllers/answerController.js';
import {
    validateAnswerInput,
    validateAnswerIdParam,
} from '../middleware/validationMiddleware.js';
import { checkForTestUser } from '../middleware/authMiddleware.js';

const router = Router();

router
    .route('/')
    .get(getAllAnswers)
    .post(checkForTestUser, validateAnswerInput, createAnswer);

router
    .route('/:id')
    .get(validateAnswerIdParam, getAnswer)
    .patch(checkForTestUser, validateAnswerInput, validateAnswerIdParam, updateAnswer)
    .delete(checkForTestUser, validateAnswerIdParam, deleteAnswer);

export default router;