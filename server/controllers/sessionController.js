const Session = require('../models/Session');
const Course = require('../models/Course');
const User = require('../models/User');
const Report = require('../models/Report');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

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
            .populate({ path: 'course', model: "Course", select: 'code' })
            .populate({ path: 'records.student', model: 'User', select: 'studentId' });


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
        const { sessionId, studentId, status } = req.body;

        const user = await User.findById(studentId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const session = await Session.findById(sessionId);
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        // Find the record for the student and update status
        const record = session.records.find(record => record.student.toString() === studentId);
        if (!record) {
            return res.status(404).json({ error: 'Record for student not found in this session' });
        }

        record.status = status;

        await session.save();
        res.status(200).json({ message: `Attendance status updated to ${status} for student ${user.studentId}`, session });
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
                if (!userId || record.student._id.toString() === userId) {
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

        const data = await report.save();

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller to get all reports
exports.getReports = async (req, res) => {
    try {
        const reports = await Report.find().populate('generatedBy', 'name email');
        res.status(200).json({ reports });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Helper function to generate a table in PDF
const generatePdfTable = (pdfDoc, data) => {
    const tableTop = 150;
    const rowHeight = 20;
    const colWidth = 100;
    const colPadding = 10;

    // Generate header row
    pdfDoc.font('Helvetica-Bold').fontSize(12);
    pdfDoc.text('Student', colPadding, tableTop);
    data[0].attendance.forEach((_, idx) => {
        pdfDoc.text(`Session ${idx + 1}`, colPadding + colWidth * (idx + 1), tableTop);
    });

    // Generate data rows
    pdfDoc.font('Helvetica').fontSize(10);
    data.forEach((sessionData, rowIndex) => {
        sessionData.attendance.forEach((attendanceData, colIndex) => {
            pdfDoc.text(attendanceData.student, colPadding, tableTop + rowHeight * (colIndex + 1));
            pdfDoc.text(attendanceData.status, colPadding + colWidth * (rowIndex + 1), tableTop + rowHeight * (colIndex + 1));
        });
    });
};

// Controller to export report
exports.exportReport = async (req, res) => {
    const { reportId, exportType } = req.body;

    try {
        // Find the report by ID
        const report = await Report.findById(reportId).populate('generatedBy', 'name email');
        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        // Check if the user requesting the export matches the generatedBy user
        //if (report.generatedBy._id.toString() !== req.params._id.toString()) {
        //  return res.status(403).json({ error: 'Unauthorized to export this report' });
        //}

        let filename = `report_${reportId}`;

        // Export based on exportType
        switch (exportType) {
            case 'pdf':
                res.contentType('application/pdf');
                filename += '.pdf';
                const pdfDoc = new PDFDocument();
                pdfDoc.pipe(res);

                // Generate PDF content from report.data
                pdfDoc.text(`Report generated by: ${report.generatedBy.name}`, { align: 'left' });
                pdfDoc.text(`Email: ${report.generatedBy.email}`, { align: 'left' });
                pdfDoc.text(`Generated on: ${new Date(report.generatedDate).toLocaleString()}`, { align: 'left' });
                pdfDoc.moveDown();

                // Generate PDF table
                generatePdfTable(pdfDoc, report.data);

                pdfDoc.end();
                break;
            case 'excel':
                res.contentType('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                filename += '.xlsx';
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Report');

                // Generate Excel content from report.data
                worksheet.columns = [
                    { header: 'Student', key: 'student', width: 20 },
                    ...report.data.map((data, idx) => ({ header: data.date, key: `session${idx + 1}`, width: 20 })),
                    { header: `Total /(${report.data.length})`, key: 'total', width: 20 }
                ];

                // Populate the worksheet with data
                const studentAttendance = {};

                report.data.forEach((sessionData, sessionIndex) => {
                    sessionData.attendance.forEach(attendanceData => {
                        const studentId = attendanceData.student;
                        if (!studentAttendance[studentId]) {
                            studentAttendance[studentId] = { student: studentId, total: 0 };
                        }
                        const status = attendanceData.status === 'present' ? 1 : 0;
                        studentAttendance[studentId][`session${sessionIndex + 1}`] = status;
                        studentAttendance[studentId].total += status;
                    });
                });

                Object.values(studentAttendance).forEach((data, rowIndex) => {
                    worksheet.addRow(data);
                });

                const fileStream = await workbook.xlsx.writeBuffer();
                res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
                res.send(fileStream);
                break;
            default:
                return res.status(400).json({ error: 'Unsupported export type' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


/*
// Function to export report
exports.exportReport = async (req, res) => {
    const { reportId, exportType } = req.body;

    try {
        // Find the report by ID
        const report = await Report.findById(reportId).populate('generatedBy', 'name email');
        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        // Check if the user requesting the export matches the generatedBy user
        // You may need additional authorization logic here based on your application's requirements
        if (report.generatedBy._id.toString() !== req.params._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized to export this report' });
        }

        let filename = `report_${reportId}`;

        // Export based on exportType
        let fileStream;
        switch (exportType) {
            case 'pdf':
                res.contentType('application/pdf');
                filename += '.pdf';
                const pdfDoc = new PDFDocument();
                pdfDoc.pipe(res);
                // Example: Generate PDF content from report.data and pdfDoc
                pdfDoc.end();
                break;
            case 'excel':
                res.contentType('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                filename += '.xlsx';
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Report');

                // Example: Generate Excel content from report.data and worksheet
                worksheet.columns = []; // Define columns as needed
                fileStream = await workbook.xlsx.writeBuffer();
                break;
            default:
                return res.status(400).json({ error: 'Unsupported export type' });
        }

        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        if (fileStream) {
            res.send(fileStream);
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

*/