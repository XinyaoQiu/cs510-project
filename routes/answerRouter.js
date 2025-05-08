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
    validateAnswerUser
} from '../middleware/validationMiddleware.js';

const router = Router();

router
    .route('/')
    .get(getAllAnswers)
    .post(validateAnswerInput, createAnswer);

router
    .route('/:id')
    .get(validateAnswerIdParam, getAnswer)
    .patch(validateAnswerInput, validateAnswerIdParam, validateAnswerUser, updateAnswer)
    .delete(validateAnswerIdParam, validateAnswerUser, deleteAnswer);

export default router;