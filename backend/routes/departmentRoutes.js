const express = require('express');
const router = express.Router();
const { getDepartments, createDepartment, updateDepartment, deleteDepartment } = require('../controllers/departmentController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getDepartments);
router.post('/', verifyToken, requireRole('Admin'), createDepartment);
router.put('/:id', verifyToken, requireRole('Admin'), updateDepartment);
router.delete('/:id', verifyToken, requireRole('Admin'), deleteDepartment);

module.exports = router;
