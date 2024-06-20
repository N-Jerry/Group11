const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./server'); // Assuming your Express app is exported from server.js

describe('Performance Testing - Attendance Marking', () => {
  let performanceCourse;
  let performanceUsers;
  let session;

  beforeAll(async () => {

    // Create performance course through API request
    const courseData = {
      title: 'Performance Course',
      code: 'PERF101',
      level: 1,
      schedule: {
        dayOfWeek: "Monday",
        startTime: "12:00 am",
        endTime: "14:00 pm"
      }
    };

    const courseResponse = await request(app)
      .post('/api/main/courses') // Adjust the endpoint based on your API design
      .send(courseData)
      .expect(201);

    performanceCourse = courseResponse.body.course;
    const id = performanceCourse._id

    // Create performance users and assign them to the performance course through API requests
    performanceUsers = await Promise.all(
      Array.from({ length: 100 }, (_, index) =>
        request(app)
          .post('/api/auth/signup')
          .send({
            name: `Performance User ${index + 1}`,
            email: `user${index + 1}@example.com`,
            password: 'Password123!',
            tel: '123456789',
            userType: 'student',
            courseCodes: [performanceCourse.code],
            studentId: `${index + 1}99999`
          })
      )
    );
  }, 60000);

  it.concurrent('should mark all users present for a session', async () => {

    // Create a session for the performance course
    const date = new Date();
    const location = 'Room 101';
    const deadline = new Date(date.getTime() + 3600000); // Deadline 1 hour after session start
    const response = await request(app)
      .post('/api/main/sessions')
      .send({
        date,
        location,
        course: '6673dd65935600ec2f72c586',
        deadline
      })
      .expect(201);

    session = response.body;
    console.log(session)

    const users = await request(app)
      .get('/api/auth/users')
      .expect(200);

    const allUsers = users.body;
    //console.log(JSON.stringify(allUsers))
    
    // Filter users whose names include "performance"
    const pusers = await allUsers.filter(user =>
      user.name.toLowerCase().includes('performance')
    );
    console.log(JSON.stringify(pusers))
    const markAttendancePromises = pusers.map(user =>
      request(app)
        .post('/api/main/sessions/mark-attendance')
        .send({
          sessionId: session._id,
          studentId: user._id
        })
        .expect(200)
    );

    await Promise.all(markAttendancePromises);

    // Verify the session attendance
    const updatedSession = await request(app)
      .get(`/api/main/sessions/${session._id}`)
      .expect(200);

    expect(updatedSession.body).toBeDefined();
    expect(updatedSession.body.records).toHaveLength(pusers.length);

    // Check that all records are marked as 'present'
    updatedSession.body.records.forEach(record => {
      expect(record.status).toBe('present');
    });
  }, 60000); // Timeout set to 60 seconds
});
