const express = require('express');
const router = express.Router();
const { getSystemReports } = require('../controllers/reportController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getSystemReports);

module.exports = router;
