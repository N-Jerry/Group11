const express = require('express');
const router = express.Router();
const { getAllCourses, createCourse, deleteCourse } = require('../controllers/courseController');

// Define routes for course-related endpoints
router.get('/courses', getAllCourses); // Protected route, requires authenication
router.post('/courses', createCourse); // Protected route, requires user
router.delete('/courses/:id', deleteCourse); // Protected route, requires user

module.exports = router;
