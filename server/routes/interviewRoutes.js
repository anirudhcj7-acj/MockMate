const express = require('express');
const router = express.Router();
const {
  startInterview,
  submitInterview,
  getInterviews,
  getInterviewById,
  getDashboardStats,
} = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');

router.post('/start', protect, startInterview);
router.post('/:id/submit', protect, submitInterview);
router.get('/', protect, getInterviews);
router.get('/stats', protect, getDashboardStats);
router.get('/:id', protect, getInterviewById);

module.exports = router;
