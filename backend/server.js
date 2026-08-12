const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect DB (with automatic fallback to high-resolution memory store if MongoDB service is unattached)
connectDB();

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/departments', require('./routes/departmentRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/leave', require('./routes/leaveRoutes'));
app.use('/api/payroll', require('./routes/payrollRoutes'));
app.use('/api/onboarding', require('./routes/onboardingRoutes'));
app.use('/api/calendar', require('./routes/calendarRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// Root & Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'NEUZEN AI HRMS Platform API Server is active and healthy.',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('[API Error]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  NEUZEN AI HRMS Express API Server running on port ${PORT}`);
  console.log(`  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});
