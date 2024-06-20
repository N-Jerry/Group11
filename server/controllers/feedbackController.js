const Feedback = require('../models/Feedback');
const User = require('../models/User');

// Method to submit feedback
const submitFeedback = async (userID, message, type) => {
    try {
        const user = await User.findById(userID);
        if (!user) throw new Error('User not found');

        const newFeedback = new Feedback({
            user: userID,
            message,
            type
        });

        await newFeedback.save();
        return newFeedback;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Method to view feedback
const viewFeedback = async (userID) => {
    try {
        const feedbacks = await Feedback.find({ user: userID });
        return feedbacks;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Method to getall feedback
const getFeedbacks = async (userID) => {
    try {
        const feedbacks = await Feedback.find({});
        return feedbacks;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = { submitFeedback, viewFeedback, getFeedbacks };
