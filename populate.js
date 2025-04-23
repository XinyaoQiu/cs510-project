import { readFile } from 'fs/promises';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import User from './models/UserModel.js';
import Question from './models/QuestionModel.js';
import Answer from './models/AnswerModel.js';
import Comment from './models/CommentModel.js';
import Vote from './models/VoteModel.js';
import Bookmark from './models/BookmarkModel.js';

// --- Configuration ---
const MOCK_DATA_DIR = './data/'; // Directory containing mock JSON files
const MOCK_QUESTIONS_FILE = 'mockQuestions.json';
const MOCK_ANSWERS_FILE = 'mockAnswers.json';
const MOCK_COMMENTS_FILE = 'mockComments.json';

const TEST_USERS_EMAILS = [
	"test1@test.com",
	"test2@test.com",
	"test3@test.com",
	"test4@test.com"
];

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


const populateDatabase = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URL);
		console.log('Connected to MongoDB...');

		console.log('Finding/Creating test users...');
		const userPromises = TEST_USERS_EMAILS.map(email =>
			User.findOne({ email: email })
		);
		const users = await Promise.all(userPromises);
		const userIds = users.map(user => user._id);
		console.log(`Found ${users.length} test users.`);

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

		const VOTE_COUNT_TO_GENERATE = 200; // Define how many votes to create
        console.log(`Generating ${VOTE_COUNT_TO_GENERATE} random votes...`);

        const votesToCreate = [];
        const uniqueVoteCheck = new Set(); // To prevent duplicate user/item votes
        const availableItemTypes = []; // Determine which item types actually have created items
        if (questionIds.length > 0) availableItemTypes.push('Question');
        if (answerIds.length > 0) availableItemTypes.push('Answer');
        if (commentIds.length > 0) availableItemTypes.push('Comment');

        if (availableItemTypes.length > 0 && userIds.length > 0) {
            for (let i = 0; i < VOTE_COUNT_TO_GENERATE; i++) {
                const itemType = getRandomElement(availableItemTypes); // Pick a valid type
                let itemId = null;

                // Get a random ID for the chosen item type
                if (itemType === 'Question') itemId = getRandomElement(questionIds);
                else if (itemType === 'Answer') itemId = getRandomElement(answerIds);
                else itemId = getRandomElement(commentIds); // Must be Comment

                const userId = getRandomElement(userIds);
                const voteValue = Math.random() < 0.8 ? '1' : '-1'; // 80% likes

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
                    voteValue: voteValue,
                });
            } // End for loop

            if (votesToCreate.length > 0) {
                await Vote.create(votesToCreate);
                console.log(`Created ${votesToCreate.length} votes.`);
            } else {
                 console.log('Could not generate any unique votes.');
            }

        } else {
             console.log('Skipping votes (no users or no items created).');
        }
        // --- End of Vote Generation ---


		// 9. Process and Create Saves (Bookmarks - Generated In-Script)
        const SAVE_COUNT_TO_GENERATE = 150; // Define how many saves to create
        console.log(`Generating ${SAVE_COUNT_TO_GENERATE} random saves (bookmarks)...`);

        const savesToCreate = [];
        const uniqueSaveCheck = new Set(); // To prevent duplicate user/item saves
        const availableSaveItemTypes = []; // Determine which item types can be saved
        if (questionIds.length > 0) availableSaveItemTypes.push('Question');
        if (answerIds.length > 0) availableSaveItemTypes.push('Answer');
        // Add 'Comment' here if comments can be saved:
        // if (commentIds.length > 0) availableSaveItemTypes.push('Comment');

        if (availableSaveItemTypes.length > 0 && userIds.length > 0) {
            for (let i = 0; i < SAVE_COUNT_TO_GENERATE; i++) {
                const itemType = getRandomElement(availableSaveItemTypes); // Pick a valid type
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
                });

                // Optional: Break early if needed
                if (savesToCreate.length >= SAVE_COUNT_TO_GENERATE) {
                    // break;
                }
            } // End for loop

            if (savesToCreate.length > 0) {
                await Bookmark.create(savesToCreate);
                console.log(`Created ${savesToCreate.length} saves (bookmarks).`);
            } else {
                 console.log('Could not generate any unique saves.');
            }

        } else {
             console.log('Skipping saves (no users or no saveable items created).');
        }
        // --- End of Save Generation ---

		// 9. Success
		console.log('Success! Database populated with mock data.');
		process.exit(0);

	} catch (error) {
		console.error('Error during database population:', error);
		process.exit(1);
	}
};

// Run the population script
populateDatabase();

