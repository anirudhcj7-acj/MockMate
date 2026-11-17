const express = require('express');
const router = express.Router();
const {
  getQuestions,
  getCategories,
} = require('../controllers/questionController');

router.get('/', getQuestions);
router.get('/categories', getCategories);

module.exports = router;
