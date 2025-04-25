import { Router } from 'express';
import { handleBookmark } from '../controllers/bookmarkController.js';
import { checkForTestUser } from '../middleware/authMiddleware.js';
import { validateBookmarkInput } from '../middleware/validationMiddleware.js';

const router = Router();

router
    .route('/')
    .post(checkForTestUser, validateBookmarkInput, handleBookmark);

export default router;