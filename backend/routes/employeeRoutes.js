const express = require('express');
const router = express.Router();
const { getEmployees, getEmployeeById, createEmployee, updateEmployee, uploadDocument, deleteEmployee } = require('../controllers/employeeController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getEmployees);
router.get('/:id', verifyToken, getEmployeeById);
router.post('/', verifyToken, requireRole('Admin', 'HR'), createEmployee);
router.post('/:id/documents', verifyToken, requireRole('Admin', 'HR'), uploadDocument);
router.put('/:id', verifyToken, updateEmployee);
router.delete('/:id', verifyToken, requireRole('Admin'), deleteEmployee);

module.exports = router;
