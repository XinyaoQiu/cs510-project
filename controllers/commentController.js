import Comment from '../models/commentModel.js';
import { StatusCodes } from 'http-status-codes';

export const createComment = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const comment = await Comment.create(req.body);
    res.status(StatusCodes.CREATED).json({ comment });
};

export const updateComment = async (req, res) => {
    const updatedComment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    res.status(StatusCodes.OK).json({ msg: 'comment modified', comment: updatedComment });
};

export const deleteComment = async (req, res) => {
    const removedComment = await Comment.findByIdAndDelete(req.params.id);
    res.status(StatusCodes.OK).json({ msg: 'comment deleted', comment: removedComment });
};