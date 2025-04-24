import Bookmark from '../models/bookmarkModel.js';
import { StatusCodes } from 'http-status-codes';

export const handleBookmark = async (req, res) => {
    const { itemType, item, value } = req.body;
    const userId = req.user.userId;
    const existingBookmark = await Bookmark.findOne({ itemType, item, user: userId });
    if (existingBookmark) {
        existingBookmark.value = value;
        await existingBookmark.save();
    } else {
        await Bookmark.create({ value, itemType, item, user: userId });
    }
    res.status(StatusCodes.OK).json({ msg: 'bookmark processed' });
}