const mongoose = require('mongoose');

const holidaySchema = new mongoose.Schema({
  holidayName: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  dayOfWeek: { type: String },
  description: { type: String },
  type: { type: String, enum: ['National', 'Festival', 'Company Event'], default: 'National' }
});

module.exports = mongoose.model('Holiday', holidaySchema);
