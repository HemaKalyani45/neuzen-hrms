const express = require('express');
const router = express.Router();
const { getCalendarEvents, addHoliday, scheduleMeeting, deleteHoliday, deleteMeeting } = require('../controllers/calendarController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getCalendarEvents);
router.post('/holiday', verifyToken, requireRole('Admin', 'HR'), addHoliday);
router.post('/meeting', verifyToken, requireRole('Admin', 'HR'), scheduleMeeting);
router.delete('/holiday/:id', verifyToken, requireRole('Admin', 'HR'), deleteHoliday);
router.delete('/meeting/:id', verifyToken, requireRole('Admin', 'HR'), deleteMeeting);

module.exports = router;
