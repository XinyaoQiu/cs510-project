// utils/profileUpdater.js
import UserProfile from '../models/UserProfileModel.js';

export const updateUserProfileWithQuestion = async (userId, question) => {
    let profile = await UserProfile.findOne({ userId });
    if (!profile) {
        profile = new UserProfile({ userId });
    }

    const cat = question.category;
    if (cat) {
        const current = profile.categoryPreference.get(cat) || 0;
        profile.categoryPreference.set(cat, current + 1);
    }

    const diff = question.difficulty;
    if (diff) {
        const current = profile.difficultyPreference.get(diff) || 0;
        profile.difficultyPreference.set(diff, current + 1);
    }

    const qid = question._id.toString();
    const old = profile.recentInteractedQuestions.map(id => id.toString());
    const recentSet = new Set([qid, ...old]);
    profile.recentInteractedQuestions = Array.from(recentSet).slice(0, 100);

    await profile.save();
};
