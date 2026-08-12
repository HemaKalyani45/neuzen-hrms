const express = require('express');
const router = express.Router();
const { checkIn, checkOut, getAttendance, getEmployeeAttendance } = require('../controllers/attendanceController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/checkin', verifyToken, checkIn);
router.post('/checkout', verifyToken, checkOut);
router.get('/', verifyToken, getAttendance);
router.get('/:employeeId', verifyToken, getEmployeeAttendance);

module.exports = router;
