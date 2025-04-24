import { Router } from 'express';
import { handleVote } from '../controllers/voteController.js';
import { checkForTestUser } from '../middleware/authMiddleware.js';
import { validateVoteInput } from '../middleware/validationMiddleware.js';

const router = Router();

router
    .route('/')
    .post(checkForTestUser, validateVoteInput, handleVote);

export default router;