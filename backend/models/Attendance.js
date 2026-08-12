const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  employeeCode: { type: String },
  employeeName: { type: String },
  date: { type: String, required: true }, // Format YYYY-MM-DD
  checkIn: { type: String },
  checkOut: { type: String },
  workingHours: { type: Number, default: 0 }, // In hours
  status: { 
    type: String, 
    enum: ['Present', 'Absent', 'Half Day', 'Leave', 'Late Entry'], 
    default: 'Present' 
  },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
