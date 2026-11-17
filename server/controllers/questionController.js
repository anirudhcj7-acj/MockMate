const Question = require('../models/Question');

// @desc    Get all questions or filter by category & difficulty
// @route   GET /api/questions
// @access  Public
const getQuestions = async (req, res) => {
  try {
    const { category, difficulty, type } = req.query;
    let query = {};

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (type) query.type = type;

    const questions = await Question.find(query);
    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all categories
// @route   GET /api/questions/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = [
      'JavaScript',
      'React.js',
      'Node.js',
      'MongoDB',
      'HTML & CSS',
      'DBMS',
      'Operating Systems',
      'Computer Networks',
      'Data Structures and Algorithms',
      'HR Interview'
    ];
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getQuestions,
  getCategories,
};
