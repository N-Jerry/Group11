const mongoose = require('mongoose');
const axios = require('axios');

// MongoDB connection URI
const uri = 'mongodb+srv://nkengbderick:fFPmMo0zztAE9Wgj@cluster0.go8reji.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Replace 'yourDatabaseName' with the actual database name

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to the database');
        insertFeedbacks();
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });

const feedbackData = [
    {
        userID: '66857363d7100ad2648d0ab8',
        message: 'The course content is very informative.',
        type: 'general'
    },
    {
        userID: '66857363d7100ad2648d0ab8',
        message: 'Found a bug in the assignment submission portal.',
        type: 'bug'
    },
    {
        userID: '66857400d7100ad2648d0ad4',
        message: 'Request to add more examples in the lecture notes.',
        type: 'feature'
    },
    {
        userID: '66857400d7100ad2648d0ad4',
        message: 'The system crashes when uploading large files.',
        type: 'bug'
    },
    {
        userID: '66857429d7100ad2648d0af1',
        message: 'Great course, but need more practical sessions.',
        type: 'general'
    },
    {
        userID: '66857429d7100ad2648d0af1',
        message: 'Feature request: Dark mode for the platform.',
        type: 'feature'
    }
];

async function insertFeedbacks() {
    try {

        for (const feedback of feedbackData) {
            // Make a POST request to create a new session
            try {
                const response = await axios.post('http://localhost:5000/api/main/feedback', feedback);  // Adjust the URL to match your route
                console.log('Session created successfully:', response.data);
            } catch (error) {
                console.error('Error creating session:', error.response ? error.response.data : error.message);
            }
        }

        console.log('Sessions insertion process completed');
        mongoose.disconnect();
    } catch (error) {
        console.error('Error inserting sessions:', error);
        mongoose.disconnect();
    }
}
