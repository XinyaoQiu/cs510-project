import { readFile } from 'fs/promises';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import User from './models/userModel.js';
import Question from './models/questionModel.js';
import Answer from './models/answerModel.js';
import Comment from './models/commentModel.js';
import Vote from './models/voteModel.js';
import Bookmark from './models/bookmarkModel.js';
import PageView from './models/pageViewModel.js';

// --- Configuration ---
const MOCK_DATA_DIR = './data/'; // Directory containing mock JSON files
const MOCK_QUESTIONS_FILE = 'mockQuestions.json';
const MOCK_ANSWERS_FILE = 'mockAnswers.json';
const MOCK_COMMENTS_FILE = 'mockComments.json';

const getRandomElement = (arr) => {
	if (!arr || arr.length === 0) return null;
	return arr[Math.floor(Math.random() * arr.length)];
};

const loadJsonData = async (fileName) => {
	try {
		const data = await readFile(new URL(`${MOCK_DATA_DIR}${fileName}`, import.meta.url));
		return JSON.parse(data);
	} catch (error) {
		console.error(`Error reading or parsing ${fileName}:`, error.message);
		return [];
	}
};

const createTestUsers = async () => {
	try {
		const USER_COUNT_TO_CREATE = 10;
		console.log(`Creating ${USER_COUNT_TO_CREATE} test users...`);
		const usersToCreate = Array.from({ length: USER_COUNT_TO_CREATE }, (_, index) => ({
			name: `Test User ${index + 1}`,
			email: `testuser${index + 1}@example.com`,
			location: `Test Location ${index + 1}`,
			lastName: `Test LastName ${index + 1}`,
			role: 'test',
		}));

		const createdUsers = await User.create(usersToCreate);
	} catch (error) {
		console.error('Error creating test users:', error.message);
		return [];
	}
}

const populateDatabase = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URL);
		console.log('Connected to MongoDB...');

		console.log('Finding/Creating test users...');
		const testUsers = await User.find({ role: 'test' });
		const userIds = testUsers.map(user => user._id);

		console.log('Clearing previous mock data (Questions, Answers, Comments, Votes)...');
		await Question.deleteMany({ createdBy: { $in: userIds } });
		await Answer.deleteMany({ createdBy: { $in: userIds } });
		await Comment.deleteMany({ createdBy: { $in: userIds } });

		// Load Mock Data from JSON files
		console.log('Loading mock data from JSON files...');
		const mockQuestions = await loadJsonData(MOCK_QUESTIONS_FILE);
		const mockAnswers = await loadJsonData(MOCK_ANSWERS_FILE);
		const mockComments = await loadJsonData(MOCK_COMMENTS_FILE);

		if (!mockQuestions.length && !mockAnswers.length && !mockComments.length && !mockVotes.length && !mockBookmarks.length) {
			console.log('No mock data found in JSON files. Exiting.');
			process.exit(0);
		}

		// Process and Create Questions
		console.log(`Processing ${mockQuestions.length} questions...`);
		const questionsToCreate = mockQuestions.map(q => ({
			...q, // Spread mock question data (title, question, company, etc.)
			createdBy: getRandomElement(userIds), // Assign random test user
		}));
		const createdQuestions = await Question.create(questionsToCreate);
		const questionIds = createdQuestions.map(q => q._id);
		console.log(`Created ${createdQuestions.length} questions.`);

		// Process and Create Answers (Requires createdQuestions)
		let createdAnswers = [];
		let answerIds = [];
		if (createdQuestions.length > 0 && mockAnswers.length > 0) {
			console.log(`Processing ${mockAnswers.length} answers...`);
			const answersToCreate = mockAnswers.map(a => ({
				...a, // Spread mock answer data (answer text)
				createdBy: getRandomElement(userIds),
				question: getRandomElement(questionIds), // Link to a random created question
			}));
			createdAnswers = await Answer.create(answersToCreate);
			answerIds = createdAnswers.map(a => a._id);
			console.log(`Created ${createdAnswers.length} answers.`);
		} else {
			console.log('Skipping answers (no questions created or no mock answers found).');
		}


		// Process and Create Comments (Requires createdQuestions and createdAnswers)
		let createdComments = [];
		let commentIds = [];
		if ((createdQuestions.length > 0 || createdAnswers.length > 0) && mockComments.length > 0) {
			console.log(`Processing ${mockComments.length} comments...`);
			const commentsToCreate = mockComments.map(c => {
				const parentType = Math.random() < 0.7 ? 'Question' : 'Answer'; // 70% chance Question
				let parentId = null;

				if (parentType === 'Question' && questionIds.length > 0) {
					parentId = getRandomElement(questionIds);
				} else if (parentType === 'Answer' && answerIds.length > 0) {
					parentId = getRandomElement(answerIds);
				} else if (questionIds.length > 0) { // Fallback to Question if Answers unavailable
					parentId = getRandomElement(questionIds);
				}

				// Skip comment if no valid parent could be assigned
				if (!parentId) return null;

				return {
					...c, // Spread mock comment data (text)
					createdBy: getRandomElement(userIds),
					parentType: parentType,
					parentId: parentId,
				};
			}).filter(c => c !== null); // Filter out comments that couldn't be assigned a parent

			if (commentsToCreate.length > 0) {
				createdComments = await Comment.create(commentsToCreate);
				commentIds = createdComments.map(c => c._id);
				console.log(`Created ${createdComments.length} comments.`);
			} else {
				console.log('Skipping comments (no valid parents or no mock comments to create).');
			}
		} else {
			console.log('Skipping comments (no questions/answers created or no mock comments found).');
		}

		// Process and Create Votes (Requires createdQuestions, createdAnswers, and createdComments)
		const VOTE_COUNT_TO_GENERATE = 1000; // Define how many votes to create
		console.log(`Generating ${VOTE_COUNT_TO_GENERATE} random votes...`);

		const votesToCreate = [];
		const uniqueVoteCheck = new Set(); // To prevent duplicate user/item votes

		for (let i = 0; i < VOTE_COUNT_TO_GENERATE; i++) {
			const itemType = Math.random() < 0.8 ? 'Question' : 'Answer'; // Pick a valid type
			let itemId = null;

			// Get a random ID for the chosen item type
			if (itemType === 'Question') itemId = getRandomElement(questionIds);
			else if (itemType === 'Answer') itemId = getRandomElement(answerIds);
			else itemId = getRandomElement(commentIds); // Must be Comment

			const userId = getRandomElement(userIds);
			const value = Math.random() < 0.8 ? 1 : -1; // 80% likes

			// Ensure user/item combo is unique for this run and item exists
			const voteKey = `${userId}-${itemType}-${itemId}`;
			if (!itemId || uniqueVoteCheck.has(voteKey)) {
				// Skip if no item ID or vote already exists for this combo
				// Optionally, you could retry generating a different combo here,
				// but for simplicity, we just skip this iteration.
				continue;
			}
			uniqueVoteCheck.add(voteKey);

			votesToCreate.push({
				user: userId,
				itemType: itemType,
				item: itemId,
				value: value,
			});
		} // End for loop

		if (votesToCreate.length > 0) {
			await Vote.create(votesToCreate);
			console.log(`Created ${votesToCreate.length} votes.`);
		} else {
			console.log('Could not generate any unique votes.');
		}


		// --- End of Vote Generation ---


		// Process and Create Bookmarks (Requires createdQuestions, createdAnswers, and createdComments)
		const SAVE_COUNT_TO_GENERATE = 1000; // Define how many saves to create
		console.log(`Generating ${SAVE_COUNT_TO_GENERATE} random saves (bookmarks)...`);

		const savesToCreate = [];
		const uniqueSaveCheck = new Set(); // To prevent duplicate user/item saves

		for (let i = 0; i < SAVE_COUNT_TO_GENERATE; i++) {
			const itemType = Math.random() < 0.8 ? 'Question' : 'Answer'; // Pick a valid type
			let itemId = null;

			// Get a random ID for the chosen item type
			if (itemType === 'Question') itemId = getRandomElement(questionIds);
			else if (itemType === 'Answer') itemId = getRandomElement(answerIds);
			// else if (itemType === 'Comment') itemId = getRandomElement(commentIds); // Uncomment if comments can be saved

			const userId = getRandomElement(userIds);

			// Ensure user/item combo is unique for this run and item exists
			const saveKey = `${userId}-${itemType}-${itemId}`;
			if (!itemId || uniqueSaveCheck.has(saveKey)) {
				// Skip if no item ID or save already exists for this combo
				continue;
			}
			uniqueSaveCheck.add(saveKey);

			savesToCreate.push({
				user: userId,
				itemType: itemType,
				item: itemId,
				value: 1
			});

			// Optional: Break early if needed
			if (savesToCreate.length >= SAVE_COUNT_TO_GENERATE) {
				// break;
			}
		} // End for loop

		if (savesToCreate.length > 0) {
			await Bookmark.create(savesToCreate);
			console.log(`Created ${savesToCreate.length} bookmarks.`);
		} else {
			console.log('Could not generate any unique bookmarks.');
		}
		// --- End of Save Generation ---
		
		// Process and Create Pageviews
		const PAGEVIEW_COUNT_TO_GENERATE = 1000; // Define how many pageviews to create
		console.log(`Generating ${PAGEVIEW_COUNT_TO_GENERATE} random pageviews...`);

		const pageviewsToCreate = [];

		for (let i = 0; i < PAGEVIEW_COUNT_TO_GENERATE; i++) {
			const userId = getRandomElement(userIds);
			const questionId = getRandomElement(questionIds);

			pageviewsToCreate.push({
				userId: userId,
				questionId: questionId
			});
		} // End for loop

		if (pageviewsToCreate.length > 0) {
			await PageView.create(pageviewsToCreate);
			console.log(`Created ${pageviewsToCreate.length} pageviews.`);
		} else {
			console.log('Could not generate any unique pageviews.');
		}
		// --- End of Pageview Generation ---


		// 9. Success
		console.log('Success! Database populated with mock data.');
		process.exit(0);

	} catch (error) {
		console.error('Error during database population:', error);
		process.exit(1);
	}
};

// Run the population script
// createTestUsers();
populateDatabase();

