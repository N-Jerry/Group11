const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

router.post('/sessions', sessionController.createSession);

router.get('/sessions', sessionController.getSessions);

router.get('/sessions/:id', sessionController.getSessionById);

router.put('/sessions/:id', sessionController.updateSession);

router.delete('/sessions/:id', sessionController.deleteSession);

router.post('/sessions/mark-attendance', sessionController.markAttendance);

router.get('/sessions/report/:id', sessionController.generateAttendanceReport);

module.exports = router;
