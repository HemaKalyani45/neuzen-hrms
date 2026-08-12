const OfferLetter = require('../models/OfferLetter');

let memoryCandidates = [
  {
    _id: 'cand1',
    candidateName: 'Elena Rostova',
    candidateEmail: 'elena.r@example.com',
    position: 'AI Engineer',
    department: 'Engineering & AI',
    joiningDate: '2026-09-01',
    salary: 92000,
    benefits: 'Health insurance, Performance bonus, Remote flex, Laptop allowance',
    status: 'Documents Uploaded',
    offerLetterNumber: 'NZ-OFF-2026-089'
  },
  {
    _id: 'cand2',
    candidateName: 'Marcus Sterling',
    candidateEmail: 'm.sterling@example.com',
    position: 'Product Designer',
    department: 'Product & Design',
    joiningDate: '2026-09-15',
    salary: 76000,
    benefits: 'Health insurance, Stock options, Learning stipend',
    status: 'Selected',
    offerLetterNumber: 'NZ-OFF-2026-090'
  }
];

const getCandidates = async (req, res) => {
  res.json({ success: true, count: memoryCandidates.length, data: memoryCandidates });
};

const createCandidate = async (req, res) => {
  try {
    const { candidateName, candidateEmail, position, department, joiningDate, salary, benefits } = req.body;
    if (!candidateName || !candidateEmail || !position) {
      return res.status(400).json({ success: false, message: 'Name, email, and position are required.' });
    }

    const newCandidate = {
      _id: `cand_${Date.now()}`,
      candidateName,
      candidateEmail,
      position,
      department: department || 'Engineering & AI',
      joiningDate: joiningDate || '2026-09-01',
      salary: Number(salary) || 80000,
      benefits: benefits || 'Standard NEUZEN AI Executive Benefits Package',
      status: 'Selected',
      offerLetterNumber: `NZ-OFF-2026-${Math.floor(100 + Math.random() * 900)}`
    };

    memoryCandidates.unshift(newCandidate);

    res.status(201).json({
      success: true,
      message: 'Candidate added to onboarding pipeline',
      data: newCandidate
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const generateOfferLetter = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const candidate = memoryCandidates.find(c => c._id === candidateId);
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    candidate.status = 'Offer Letter Sent';

    res.json({
      success: true,
      message: `Official Offer Letter generated and dispatched to ${candidate.candidateEmail}`,
      data: {
        offerLetterNumber: candidate.offerLetterNumber,
        candidateName: candidate.candidateName,
        candidateEmail: candidate.candidateEmail,
        position: candidate.position,
        department: candidate.department,
        joiningDate: candidate.joiningDate,
        salary: candidate.salary,
        benefits: candidate.benefits,
        hrSignature: 'NEUZEN AI HR Team',
        issuedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCandidateStatus = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const { status } = req.body;
    const candidate = memoryCandidates.find(c => c._id === candidateId);
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }
    candidate.status = status;
    res.json({ success: true, message: `Candidate status updated to ${status}`, data: candidate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCandidates,
  createCandidate,
  generateOfferLetter,
  updateCandidateStatus,
  memoryCandidates
};
