const express = require('express');
const router = express.Router();
const { generatePayroll, getPayroll, getPayslipByEmployee, raiseQuery, solveQuery } = require('../controllers/payrollController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.post('/', verifyToken, requireRole('HR'), generatePayroll);
router.post('/:id/query', verifyToken, requireRole('Admin'), raiseQuery);
router.post('/:id/solve', verifyToken, requireRole('HR'), solveQuery);
router.get('/', verifyToken, getPayroll);
router.get('/payslip/:employeeId', verifyToken, getPayslipByEmployee);

module.exports = router;
