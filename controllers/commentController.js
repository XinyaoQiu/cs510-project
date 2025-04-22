import Comment from '../models/CommentModel.js';
import { StatusCodes } from 'http-status-codes';

export const getAllComments = async (req, res) => {
    const { parentType, parentId, userId } = req.params;

    const sortOptions = {
        newest: '-createdAt',
        oldest: 'createdAt',
        
    };
}