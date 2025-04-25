import Vote from "../models/voteModel.js";
import { StatusCodes } from "http-status-codes";

/*
    @route POST /api/votes
    @body { value: Number, itemType: String, item: String }
*/
export const handleVote = async (req, res) => {
    const { value, itemType, itemId } = req.body;
    const userId = req.user.userId;
    const existingVote = await Vote.findOne({ itemType, itemId, userId });
    if (existingVote) {
        existingVote.value = value;
        await existingVote.save();
    } else {
        await Vote.create({ value, itemType, itemId, userId });
    }
    res.status(StatusCodes.OK).json({ msg: 'vote processed' });
}