const express = require('express');
const { sendNotification, markAsRead, getUserNotifications } = require('../controllers/notificationCotroller');
const { submitFeedback, viewFeedback, getFeedbacks, updateFeedbackStatus } = require('../controllers/feedbackController');
const router = express.Router();

router.post('/send-notification', sendNotification);
router.post('/mark-as-read', markAsRead);
router.get('/notifications/:userID', getUserNotifications);

router.post('/feedback', submitFeedback);
router.get('/feedbacks', getFeedbacks);
router.get('/feedbacks/:userID', viewFeedback);
router.put('/feedbacks', updateFeedbackStatus);

module.exports = router;
