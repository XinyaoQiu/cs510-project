import { StatusCodes } from 'http-status-codes';
import User from '../models/UserModel.js';
import Question from '../models/QuestionModel.js';
import Answer from '../models/AnswerModel.js';
import cloudinary from 'cloudinary';
import { formatImage } from '../middleware/multerMiddleware.js';
import UserProfile from '../models/UserProfile.js';
import redis from '../utils/redis.js';

export const getCurrentUser = async (req, res) => {
	const user = await User.findOne({ _id: req.user.userId });
	const userWithoutPassword = user.toJSON();
	res.status(StatusCodes.OK).json({ user: userWithoutPassword });
};
export const getApplicationStats = async (req, res) => {
	const users = await User.countDocuments();
	const questions = await Question.countDocuments();
	const answers = await Answer.countDocuments();
	res.status(StatusCodes.OK).json({ users, questions, answers });
};
export const updateUser = async (req, res) => {
	const newUser = { ...req.body };
	delete newUser.password;
	delete newUser.role;

	if (req.file) {
		const file = formatImage(req.file);
		const response = await cloudinary.v2.uploader.upload(file);
		newUser.avatar = response.secure_url;
		newUser.avatarPublicId = response.public_id;
	}
	const updatedUser = await User.findByIdAndUpdate(req.user.userId, newUser);

	if (req.file && updatedUser.avatarPublicId) {
		await cloudinary.v2.uploader.destroy(updatedUser.avatarPublicId);
	}

	res.status(StatusCodes.OK).json({ msg: 'update user' });
};

const recommendQuestions = async (userId) => {
	const profile = await UserProfile.findOne({ userId });

	if (!profile) return [];

	const topCategories = Array.from(profile.categoryPreference.entries())
		.sort((a, b) => b[1] - a[1])
		.slice(0, 2)
		.map(([cat]) => cat);

	const topDifficulties = Array.from(profile.difficultyPreference.entries())
		.sort((a, b) => b[1] - a[1])
		.slice(0, 2)
		.map(([dif]) => dif);

	const questions = await Question.find({
		category: { $in: topCategories },
		difficulty: { $in: topDifficulties },
		_id: { $nin: profile.recentInteractedQuestions }
	})
		.sort({ createdAt: -1 })
		.limit(10)
		.lean();

	return questions;
};

export const getRecommendations = async (req, res) => {
	const userId = req.user.userId;
	const cacheKey = `user:recommendations:${userId}`;

	try {
		const cached = await redis.get(cacheKey);

		if (cached) {
			const questionIds = JSON.parse(cached);
			const questions = await Question.find({ _id: { $in: questionIds } }).lean();
			return res.json(questions);
		}

		const recommendations = await recommendQuestions(userId);
		const questionIds = recommendations.map(q => q._id);

		await redis.set(cacheKey, JSON.stringify(questionIds), 'EX', 86400);

		res.json(recommendations);
	} catch (err) {
		console.error('Recommendation Error:', err);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};
