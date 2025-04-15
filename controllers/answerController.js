import Answer from '../models/AnswerModel.js';
import { StatusCodes } from 'http-status-codes';

export const getAllAnswers = async (req, res) => {
    const { search, questionId, userId, sort } = req.query;

    const queryObject = {};

    if (search) {
        queryObject.$or = [
            { answer: { $regex: search, $options: 'i' } },
        ];
    }

    if (questionId && questionId !== 'all') {
        queryObject.question = questionId;
    }

    if (userId && userId !== 'all') {
        queryObject.createdBy = userId;
    }

    const sortOptions = {
        newest: '-createdAt',
        oldest: 'createdAt',
        'a-z': 'answer',
        'z-a': '-answer',
    };

    const sortKey = sortOptions[sort] || sortOptions.newest;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const answers = await Answer.find(queryObject)
        .sort(sortKey)
        .skip(skip)
        .limit(limit);

    const totalAnswers = await Answer.countDocuments(queryObject);
    const numOfPages = Math.ceil(totalAnswers / limit);

    res.status(StatusCodes.OK).json({ answers, totalAnswers, numOfPages, currentPage: page });
}

export const getAnswer = async (req, res) => {
    const answer = await Answer.findById(req.params.id);
    res.status(StatusCodes.OK).json({ answer });
};

export const createAnswer = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const answer = await Answer.create(req.body);
    res.status(StatusCodes.CREATED).json({ answer });
};

export const updateAnswer = async (req, res) => {
    const updatedAnswer = await Answer.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    res.status(StatusCodes.OK).json({ msg: 'answer modified', answer: updatedAnswer });
};

export const deleteAnswer = async (req, res) => {
    const removedAnswer = await Answer.findByIdAndDelete(req.params.id);
    res.status(StatusCodes.OK).json({ msg: 'answer deleted', answer: removedAnswer });
};
