import Question from "../models/QuestionModel.js";
import { StatusCodes } from "http-status-codes";
import redis from "../utils/redis.js";
import updateUserProfileWithQuestion from "../utils/profileUpdater.js";

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
    const { id: questionId } = req.params;
    const userId = req.user.userId;

    const pipeline = [
        {
            $match: {
                _id: new mongoose.Types.ObjectId(questionId)
            }
        },
        {
            $lookup: { from: 'answers', localField: '_id', foreignField: 'question', as: 'answerDocs' }
        },
        {
            $lookup: {
                from: 'comments',
                let: { questionId: '$_id' },
                pipeline: [
                    { $match: { $expr: { $and: [{ $eq: ['$parentId', '$$questionId'] }, { $eq: ['$parentType', 'Question'] }] } } },
                    { $project: { _id: 1 } }
                ],
                as: 'commentDocs'
            }
        },
        {
            $lookup: {
                from: 'votes',
                let: { questionId: '$_id' },
                pipeline: [
                    { $match: { $expr: { $and: [{ $eq: ['$item', '$$questionId'] }, { $eq: ['$itemType', 'Question'] }] } } },
                    { $project: { _id: 1, voteType: 1 } }
                ],
                as: 'voteDocs'
            }
        },
        {
            $addFields: {
                likeCount: { $size: { $filter: { input: '$voteDocs', as: 'vote', cond: { $eq: ['$$vote.voteValue', '1'] } } } },
                dislikeCount: { $size: { $filter: { input: '$voteDocs', as: 'vote', cond: { $eq: ['$$vote.voteValue', '-1'] } } } }
            }
        },
        {
            $project: {
                title: 1, question: 1, company: 1, category: 1, difficulty: 1, createdBy: 1, createdAt: 1, updatedAt: 1,
                likeCount: 1, dislikeCount: 1, voteDocs: 0
            }
        },
        { $limit: 1 }
    ];

    const results = await Question.aggregate(pipeline);

    const question = results[0];

    const redisKey = `pv:${userId}:${id}`;
    const alreadyViewed = await redis.get(redisKey);

    if (!alreadyViewed) {
        await PageView.create({ userId, questionId: id });
        await updateUserProfileWithQuestion(userId, question);
        await redis.set(redisKey, 1, 'EX', 60);
    }

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