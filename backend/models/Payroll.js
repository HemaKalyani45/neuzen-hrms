const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  employeeCode: { type: String },
  employeeName: { type: String },
  designation: { type: String },
  department: { type: String },
  month: { type: String, required: true }, // e.g. "August"
  year: { type: Number, required: true },  // e.g. 2026
  basicSalary: { type: Number, required: true },
  hra: { type: Number, default: 0 },
  medicalAllowance: { type: Number, default: 0 },
  specialAllowance: { type: Number, default: 0 },
  bonus: { type: Number, default: 0 },
  pfDeduction: { type: Number, default: 0 },
  taxDeduction: { type: Number, default: 0 },
  leaveDeduction: { type: Number, default: 0 },
  lateDeduction: { type: Number, default: 0 },
  netSalary: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['Paid', 'Pending', 'Processing'], default: 'Paid' },
  generatedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payroll', payrollSchema);
