import Question from "../models/QuestionModel";
import { StatusCodes } from "http-status-codes";

export const getAllQuestions = async (req, res) => {
    const { search, category, difficulty, sort, userId } = req.query;

    const queryObject = {};

    if (search) {
        queryObject.$or = [
            { title: { $regex: search, $options: 'i' } },
            { question: { $regex: search, $options: 'i' } },
            { company: { $regex: search, $options: 'i' } },
        ];
    }

    if (userId && userId !== 'all') {
        queryObject.createdBy = userId;
    }

    if (category && category !== 'all') {
        queryObject.category = category;
    }

    if (difficulty && difficulty !== 'all') {
        queryObject.difficulty = difficulty;
    }

    const sortOptions = {
        newest: '-createdAt',
        oldest: 'createdAt',
        'a-z': 'question',
        'z-a': '-question',
    };

    const sortKey = sortOptions[sort] || sortOptions.newest;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const questions = await Question.find(queryObject)
        .sort(sortKey)
        .skip(skip)
        .limit(limit);

    const totalQuestions = await Question.countDocuments(queryObject);
    const numOfPages = Math.ceil(totalQuestions / limit);

    res.status(StatusCodes.OK).json({
        questions,
        totalQuestions,
        numOfPages,
        currentPage: page,
    });
};

export const getQuestion = async (req, res) => {
    const question = await Question.findById(req.params.id);
    res.status(StatusCodes.OK).json({ question });
};

export const createQuestion = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const question = await Question.create(req.body);
    res.status(StatusCodes.CREATED).json({ question });
};

export const updateQuestion = async (req, res) => {
    const updatedQuestion = await Question.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    res.status(StatusCodes.OK).json({ msg: 'question modified', question: updatedQuestion });
};

export const deleteQuestion = async (req, res) => {
    const removedQuestion = await Question.findByIdAndDelete(req.params.id);
    res.status(StatusCodes.OK).json({ msg: 'question deleted', question: removedQuestion });
};