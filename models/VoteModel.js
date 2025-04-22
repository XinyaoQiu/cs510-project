import mongoose from 'mongoose';

const VoteSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        itemType: {
            type: String,
            required: true,
            enum: ['Question', 'Answer', 'Comment'],
        },
        item: {
            type: mongoose.Types.ObjectId,
            required: true,
            refPath: 'itemType',
        },
        voteValue: {
            type: Number,
            required: true,
            enum: [1, -1], // 1 for like, -1 for dislike
        }
    },
    { timestamps: true } // Adds createdAt and updatedAt timestamps
);

VoteSchema.index({ user: 1, itemType: 1, item: 1 }, { unique: true });

VoteSchema.index({ itemType: 1, item: 1, voteType: 1 });


export default mongoose.model('Vote', VoteSchema);