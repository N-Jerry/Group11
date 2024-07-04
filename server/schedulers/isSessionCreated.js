const cron = require('node-cron');
const Course = require('../models/Course');
const Session = require('../models/Session');
const Notification = require('../models/Notification');
const { sendEmail } = require('../controllers/nodeMailer');

// Function to check for ongoing courses and send notifications
const checkOngoingCourses = async () => {
    const now = new Date();
    const dayOfWeek = now.toLocaleString('en-US', { weekday: 'long' });
    const currentTime = now.toTimeString().split(' ')[0]; // Get current time in HH:MM:SS format

    try {
        // Find courses that have a schedule for the current day and time
        const courses = await Course.find({
            schedule: {
                $elemMatch: {
                    dayOfWeek,
                    startTime: { $lte: currentTime },
                    endTime: { $gte: currentTime }
                }
            }
        });

        for (const course of courses) {
            // Check if a session exists for this course and date
            const sessionExists = await Session.findOne({
                course: course._id,
                date: {
                    $gte: new Date(now.setHours(0, 0, 0, 0)),
                    $lt: new Date(now.setHours(23, 59, 59, 999))
                }
            });

            if (!sessionExists) {
                // Send notification to the course instructor or relevant users
                const instructor = await User.findById(course.instructor); // Assuming you have an instructor field in the course model
                const message = `Reminder: No session created for course ${course.title} (${course.code}) on ${dayOfWeek} at ${currentTime}`;

                if (instructor) {
                    const notification = new Notification({
                        user: instructor._id,
                        message,
                        type: 'email'
                    });

                    await notification.save();
                    await sendEmail(instructor.email, 'Course Session Reminder', message);
                    await sendEmail("nkengbderick@gmail.com", 'Course Session Reminder', message);
                }
            }
        }
    } catch (error) {
        console.error('Error checking ongoing courses:', error);
    }
};

// Schedule the task to run every 5 minutes
cron.schedule('*/1 * * * *', checkOngoingCourses);
