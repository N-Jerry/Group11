const Session = require('../models/Session');
const Course = require('../models/Course');
const User = require('../models/User');
const Report = require('../models/Report');

// Helper function to validate records
const validateRecords = async (records) => {
    for (let record of records) {
        const user = await User.findById(record.student);
        if (!user) {
            throw new Error(`User with ID ${record.student} not found`);
        }
        if (user.userType !== 'student') {
            throw new Error(`User with ID ${record.student} is not a student`);
        }
    }
};

// Create a new session
exports.createSession = async (req, res) => {
    try {
        const { date, location, course, deadline } = req.body;

        // Ensure the course exists
        const courseExists = await Course.findById(course);
        if (!courseExists) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Get all students
        const students = await User.find({ userType: 'student', courseCodes: courseExists.code });

        // Initialize records with all students set to 'absent'
        const records = students.map(student => ({
            status: 'absent',
            student: student._id
        }));

        // Validate records if provided
        if (records && records.length > 0) {
            await validateRecords(records);
        }

        const session = new Session({
            date,
            location,
            course,
            deadline,
            records
        });

        await session.save();
        res.status(201).json(session);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all sessions
exports.getSessions = async (req, res) => {
    try {
        const sessions = await Session.find()
            .populate({ path: 'course', model: "Course", select: 'code'})
            .populate({ path: 'records.student', model: 'User', select: 'studentId'});


        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a session by ID
exports.getSessionById = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id).populate('course').populate('records.student');
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }
        res.status(200).json(session);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a session
exports.updateSession = async (req, res) => {
    try {
        const { date, location, deadline, course, records } = req.body;

        const session = await Session.findById(req.params.id);
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        // Validate records if provided
        if (records && records.length > 0) {
            await validateRecords(records);
        }

        if (date) session.date = date;
        if (deadline) session.deadline = deadline;
        if (location) session.location = location;
        if (course) session.course = course;
        if (records) session.records = records;

        await session.save();
        res.status(200).json(session);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a session
exports.deleteSession = async (req, res) => {
    try {
        const session = await Session.findByIdAndDelete(req.params.id);
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }
        res.status(200).json({ message: 'Session deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Mark attendance for a student
exports.markAttendance = async (req, res) => {
    try {
        const { sessionId, studentId } = req.body;

        const user = await User.findById(studentId)
        const session = await Session.findById(sessionId);
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        // Find the record for the student and update status to 'present'
        const record = session.records.find(record => record.student.toString() === studentId);
        if (!record) {
            return res.status(404).json({ error: 'Record for student not found in this session' });
        }

        record.status = 'present';

        await session.save();
        res.status(200).json({message: `Student ${user.studentId} is present for ${session.date}`, session: session});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Helper function to calculate attendance percentages
const calculateAttendancePercentage = (presentCount, totalCount) => {
    if (totalCount === 0) {
        return '0%';
    }
    const percentage = (presentCount / totalCount) * 100;
    return percentage.toFixed(2) + '%';
};

// Generate attendance report
exports.generateAttendanceReport = async (req, res) => {
    try {
        const { courseId, sessionId, userId, timeFilter } = req.body;

        const filters = {};

        // Apply filters based on query parameters
        if (courseId) {
            filters.course = courseId;
        }
        if (sessionId) {
            filters._id = sessionId;
        }
        if (userId) {
            filters['records.student'] = userId;
        }
        if (timeFilter === 'last_month') {
            filters.date = { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) };
        } else if (timeFilter === 'last_week') {
            filters.date = { $gte: new Date(new Date().setDate(new Date().getDate() - 7)) };
        }

        // Query sessions based on filters
        const sessions = await Session.find(filters).populate('course').populate({
            path: 'records.student',
            model: 'User',
            select: 'studentId'
        });

        // Prepare report data
        const reportData = sessions.map(session => {
            const sessionData = {
                session: session._id,
                date: session.date,
                course: session.course.name,
                location: session.location,
                attendance: []
            };

            // Calculate attendance for each record
            session.records.forEach(record => {
                if (!userId || record.student.toString() === userId) {
                    const attendanceData = {
                        student: record.student.studentId,
                        status: record.status
                    };
                    sessionData.attendance.push(attendanceData);
                }
            });

            // Calculate overall attendance percentage for the session
            const presentCount = session.records.filter(record => record.status === 'present').length;
            const totalCount = session.records.length;
            sessionData.attendancePercentage = calculateAttendancePercentage(presentCount, totalCount);

            return sessionData;
        });

        // Save the report to the database
        const report = new Report({
            generatedBy: req.params.id,
            reportType: 'pdf',
            parameters: req.body,
            data: reportData
        });

        await report.save();

        res.status(200).json(reportData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};