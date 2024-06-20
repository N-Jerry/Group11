const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendEmail } = require('./nodeMailer');

// Method to send a notification
const sendNotification = async (req, res) => {
    const { userID, type, message } = req.body;
    try {
        const user = await User.findById(userID);
        if (!user) {return res.status(404).json({ error: 'User not found' });}

        // Create a new notification
        const newNotification = new Notification({
            user: userID,
            type,
            message
        });

        // Save the notification to the database
        await newNotification.save();

        // If the notification type is email, send an email
        if (type === 'email') {
            await sendEmail(user.email, 'New Notification', message);
            await sendEmail('nkengbderick@gmail.com', 'New Notification from Atiu Tubo', message);
        }

        return res.status(201).json({ message: 'Notification sent', notification: newNotification });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Method to mark a notification as read
const markAsRead = async (notificationID) => {
    try {
        const notification = await Notification.findById(notificationID);
        if (!notification) throw new Error('Notification not found');

        notification.read = true;
        await notification.save();
        return notification;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Method to get notifications for a user
const getUserNotifications = async (userID) => {
    try {
        const notifications = await Notification.find({ user: userID }).sort({ timestamp: -1 });
        return notifications;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = { sendNotification, markAsRead, getUserNotifications };
