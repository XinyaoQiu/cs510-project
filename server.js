import 'express-async-errors';
import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';
import next from 'next';

import questionRouter from './routes/questionRouter.js';
import answerRouter from './routes/answerRouter.js';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';
import voteRouter from './routes/voteRouter.js';
import bookmarkRouter from './routes/bookmarkRouter.js';

import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
import { authenticateUser } from './middleware/authMiddleware.js';

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_API_KEY,
//   api_secret: process.env.CLOUD_API_SECRET,
// });

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev, dir: './frontend' });  // Point to the Next.js frontend directory
const handle = nextApp.getRequestHandler();

const app = express();

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.use(cookieParser());
app.use(express.json());
app.use(helmet({
	contentSecurityPolicy: false
  }));
app.use(mongoSanitize());

app.use(cors({
	origin: 'http://localhost:3000',
	credentials: true
}));

// Backend routes
app.get('/api/v1/test', (req, res) => {
	res.json({ msg: 'test route' });
});
app.use('/api/v1/questions', authenticateUser, questionRouter);
app.use('/api/v1/answers', authenticateUser, answerRouter);
app.use('/api/v1/users', authenticateUser, userRouter);
app.use('/api/v1/votes', authenticateUser, voteRouter);
app.use('/api/v1/bookmark', authenticateUser, bookmarkRouter);
app.use('/api/v1/auth', authRouter);

// Handle frontend requests through Next
await nextApp.prepare();  // Wait for Next.js to boot

app.all('*', (req, res) => {
	return handle(req, res);  // Let Next handle everything else
});

app.use('*', (req, res) => {
	res.status(404).json({ msg: 'not found' });
});

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

try {
	await mongoose.connect(process.env.MONGO_URL);
	app.listen(port, () => {
		console.log(`Server is running on http://localhost:${port}`);
	});
} catch (error) {
	console.log(error);
	process.exit(1);
}
