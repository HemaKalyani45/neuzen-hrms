const express = require('express');
const router = express.Router();
const { applyLeave, getLeaves, updateLeaveStatus, deleteLeave } = require('../controllers/leaveController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.post('/', verifyToken, applyLeave);
router.get('/', verifyToken, getLeaves);
router.put('/:id', verifyToken, requireRole('Admin', 'HR'), updateLeaveStatus);
router.delete('/:id', verifyToken, deleteLeave);

module.exports = router;
