import Bookmark from '../models/bookmarkModel.js';
import { StatusCodes } from 'http-status-codes';

export const handleBookmark = async (req, res) => {
    const { itemType, itemId, value } = req.body;
    const userId = req.user.userId;
    const existingBookmark = await Bookmark.findOne({ itemType, itemId, userId });
    if (existingBookmark) {
        existingBookmark.value = value;
        await existingBookmark.save();
    } else {
        await Bookmark.create({ value, itemType, itemId, userId });
    }
    res.status(StatusCodes.OK).json({ msg: 'bookmark processed' });
}