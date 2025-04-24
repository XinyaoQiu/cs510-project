import mongoose from 'mongoose';

const VoteSchema = new mongoose.Schema(
    {
        itemType: {
            type: String,
            required: true,
            enum: ['Question', 'Answer', 'Comment'],
        },
        itemId: {
            type: mongoose.Types.ObjectId,
            required: true,
            refPath: 'itemType',
        },
        value: {
            type: Number,
            required: true,
            enum: [1, 0, -1], // 1 for like, 0 for no vote, -1 for dislike
        },
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
    },
    { timestamps: true }
);

VoteSchema.index({ itemType: 1, item: 1, user: 1 }, { unique: true });

VoteSchema.index({ itemType: 1, item: 1, voteType: 1 });


export default mongoose.model('Vote', VoteSchema);