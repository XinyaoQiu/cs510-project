import Vote from "../models/voteModel.js";
import { StatusCodes } from "http-status-codes";

/*
    @route POST /api/votes
    @body { value: Number, itemType: String, item: String }
*/
export const handleVote = async (req, res) => {
    const { value, itemType, item } = req.body;
    const userId = req.user.userId;
    const existingVote = await Vote.findOne({ itemType, item, user: userId });
    if (existingVote) {
        existingVote.value = value;
        await existingVote.save();
    } else {
        await Vote.create({ value, itemType, item, user: userId });
    }
    res.status(StatusCodes.OK).json({ msg: 'vote processed' });
}