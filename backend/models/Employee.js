const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  employeeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  dob: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
  address: { type: String },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  departmentName: { type: String },
  designation: { type: String, required: true },
  joiningDate: { type: String, required: true },
  salary: { type: Number, required: true },
  manager: { type: String },
  photo: { type: String },
  emergencyContact: {
    name: { type: String },
    relation: { type: String },
    phone: { type: String }
  },
  documents: [
    {
      name: String,
      url: String,
      type: String
    }
  ],
  onboardingStatus: {
    type: String,
    enum: ['Selected', 'Documents Uploaded', 'Offer Letter Sent', 'Accepted', 'Activated'],
    default: 'Activated'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Employee', employeeSchema);
