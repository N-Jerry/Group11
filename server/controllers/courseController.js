const Course = require('../models/Course');

// Controller function to get all courses
const getAllCourses = (req, res) => {
    Course.find()
        .then(course => {
            res.send(course);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: "Internal Server Error" });
        });
};

// Controller function to create new course
const createCourse = (req, res) => {
    const { title, code, level, schedule } = req.body;
    const newCourse = new Course({ title, code, level, schedule });

    newCourse.save()
        .then(course => {
            res.status(201).json({ course, message: 'Course created Successfully' });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: "Internal Server Error" });
        });
};

// Controller function to delete course
const deleteCourse = (req, res) => {
    const { id } = req.params;

    Course.findByIdAndDelete(id)
        .then(deletedCourse => {
            if (!deletedCourse) {
                return res.status(404).json({ error: "Course not found" });
            }
            res.json({ message: "Course deleted successfully" });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: "Internal Server Error" });
        });
};


module.exports = { getAllCourses, createCourse, deleteCourse };
