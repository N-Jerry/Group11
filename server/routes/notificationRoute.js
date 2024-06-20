const express = require('express');
const { sendNotification, markAsRead, getUserNotifications } = require('../controllers/notificationCotroller');
const router = express.Router();

router.post('/send-notification', sendNotification);
router.post('/mark-as-read', markAsRead);
router.get('/notifications/:userID', getUserNotifications);

module.exports = router;
