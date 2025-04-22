import { body, param, validationResult } from 'express-validator';
import {
	BadRequestError,
	NotFoundError,
	UnauthorizedError,
} from '../errors/customErrors.js';
import mongoose from 'mongoose';
import User from '../models/UserModel.js';
import Question from '../models/QuestionModel.js';
import Answer from '../models/AnswerModel.js';
import Comment from '../models/CommentModel.js';
import { QUESTION_CATEGORIES, QUESTION_DIFFICULTIES } from '../utils/constants.js';

const withValidationErrors = (validateValues) => {
	return [
		validateValues,
		(req, res, next) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				const errorMessages = errors.array().map((error) => error.msg);

				const firstMessage = errorMessages[0];
				console.log(Object.getPrototypeOf(firstMessage));
				if (errorMessages[0].startsWith('no ')) {
					throw new NotFoundError(errorMessages);
				}
				if (errorMessages[0].startsWith('not authorized')) {
					throw new UnauthorizedError('not authorized to access this route');
				}
				throw new BadRequestError(errorMessages);
			}
			next();
		},
	];
};

export const validateQuestionInput = withValidationErrors([
	body('title').notEmpty().withMessage('title is required'),
	body('question').notEmpty().withMessage('question is required'),
	body('category')
		.isIn(Object.values(QUESTION_CATEGORIES))
		.withMessage('invalid category value'),
	body('difficulty')
		.isIn(Object.values(QUESTION_DIFFICULTIES))
		.withMessage('invalid difficulty value'),
])

export const validateAnswerInput = withValidationErrors([
	body('answer').notEmpty().withMessage('answer is required'),
	body('question')
		.notEmpty()
		.withMessage('question is required')
		.custom(async (value, { req }) => {
			const isValidMongoId = mongoose.Types.ObjectId.isValid(value);
			if (!isValidMongoId) throw new BadRequestError('invalid MongoDB id');
			const question = await Question.findById(value);
			if (!question) throw new NotFoundError(`no question with id ${value}`);
		})
])

export const validateCommentInput = withValidationErrors([
	body('text').notEmpty().withMessage('text is required'),
	body('parentType')
		.isIn(['Question', 'Answer'])
		.withMessage('invalid parent type'),
	body('parentId')
		.notEmpty()
		.withMessage('parent id is required')
		.custom(async (value, { req }) => {
			const isValidMongoId = mongoose.Types.ObjectId.isValid(value);
			if (!isValidMongoId) throw new BadRequestError('invalid MongoDB id');
			if (req.body.parentType === 'Question') {
				const question = await Question.findById(value);
				if (!question) throw new NotFoundError(`no question with id ${value}`);
			} else if (req.body.parentType === 'Answer') {
				const answer = await Answer.findById(value);
				if (!answer) throw new NotFoundError(`no answer with id ${value}`);
			}
		})
])

export const validateQuestionIdParam = withValidationErrors([
	param('id').custom(async (value, { req }) => {
		const isValidMongoId = mongoose.Types.ObjectId.isValid(value);
		if (!isValidMongoId) throw new BadRequestError('invalid MongoDB id');
		const question = await Question.findById(value);
		if (!question) throw new NotFoundError(`no question with id ${value}`);
	}),
]);

export const validateAnswerIdParam = withValidationErrors([
	param('id').custom(async (value, { req }) => {
		const isValidMongoId = mongoose.Types.ObjectId.isValid(value);
		if (!isValidMongoId) throw new BadRequestError('invalid MongoDB id');
		const answer = await Answer.findById(value);
		if (!answer) throw new NotFoundError(`no answer with id ${value}`);
	}),
]);

export const validateCommentIdParam = withValidationErrors([
	param('id').custom(async (value, { req }) => {
		const isValidMongoId = mongoose.Types.ObjectId.isValid(value);
		if (!isValidMongoId) throw new BadRequestError('invalid MongoDB id');
		const comment = await Comment.findById(value);
		if (!comment) throw new NotFoundError(`no comment with id ${value}`);
	}),
])

export const validateRegisterInput = withValidationErrors([
	body('name').notEmpty().withMessage('name is required'),
	body('email')
		.notEmpty()
		.withMessage('email is required')
		.isEmail()
		.withMessage('invalid email format')
		.custom(async (email) => {
			const user = await User.findOne({ email });
			if (user) {
				throw new BadRequestError('email already exists');
			}
		}),
	body('password')
		.notEmpty()
		.withMessage('password is required')
		.isLength({ min: 8 })
		.withMessage('password must be at least 8 characters long'),
	body('location').notEmpty().withMessage('location is required'),
	body('lastName').notEmpty().withMessage('last name is required'),
]);

export const validateLoginInput = withValidationErrors([
	body('email')
		.notEmpty()
		.withMessage('email is required')
		.isEmail()
		.withMessage('invalid email format'),
	body('password').notEmpty().withMessage('password is required'),
]);

export const validateUpdateUserInput = withValidationErrors([
	body('name').notEmpty().withMessage('name is required'),
	body('email')
		.notEmpty()
		.withMessage('email is required')
		.isEmail()
		.withMessage('invalid email format')
		.custom(async (email, { req }) => {
			const user = await User.findOne({ email });
			if (user && user._id.toString() !== req.user.userId) {
				throw new BadRequestError('email already exists');
			}
		}),

	body('location').notEmpty().withMessage('location is required'),
	body('lastName').notEmpty().withMessage('last name is required'),
]);
