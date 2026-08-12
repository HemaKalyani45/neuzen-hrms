const express = require('express');
const router = express.Router();
const { getCandidates, createCandidate, generateOfferLetter, updateCandidateStatus } = require('../controllers/onboardingController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.get('/', verifyToken, requireRole('Admin', 'HR'), getCandidates);
router.post('/', verifyToken, requireRole('Admin', 'HR'), createCandidate);
router.post('/offer-letter/:candidateId', verifyToken, requireRole('Admin', 'HR'), generateOfferLetter);
router.put('/:candidateId/status', verifyToken, requireRole('Admin', 'HR'), updateCandidateStatus);

module.exports = router;
