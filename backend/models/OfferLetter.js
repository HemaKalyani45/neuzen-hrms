const mongoose = require('mongoose');

const offerLetterSchema = new mongoose.Schema({
  offerLetterNumber: { type: String, required: true, unique: true },
  candidateName: { type: String, required: true },
  candidateEmail: { type: String, required: true },
  position: { type: String, required: true },
  department: { type: String, required: true },
  joiningDate: { type: String, required: true },
  salary: { type: Number, required: true },
  benefits: { type: String },
  hrSignature: { type: String, default: 'NEUZEN AI HR Team' },
  status: { type: String, enum: ['Issued', 'Accepted', 'Declined'], default: 'Issued' },
  generatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('OfferLetter', offerLetterSchema);
