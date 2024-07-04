const Feedback = require('../models/Feedback');
const User = require('../models/User');

// Method to submit feedback
const submitFeedback = async (req, res) => {
    const { userID, message, type } = req.body;
    try {
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const newFeedback = new Feedback({
            user: userID,
            message,
            type
        });

        await newFeedback.save();
        res.status(201).json(newFeedback);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Method to view feedback for a specific user
const viewFeedback = async (req, res) => {
    const { userID } = req.params;
    try {
        const feedbacks = await Feedback.find({ user: userID });
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Method to get all feedbacks
const getFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find({});
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Method to update feedback status
const updateFeedbackStatus = async (req, res) => {
    const { feedbackID, status } = req.body;
    try {
        const feedback = await Feedback.findById(feedbackID);
        if (!feedback) {
            return res.status(404).json({ error: 'Feedback not found' });
        }

        feedback.status = status;
        await feedback.save();
        res.status(200).json(feedback);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { submitFeedback, viewFeedback, getFeedbacks, updateFeedbackStatus };
