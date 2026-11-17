const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  interviewType: {
    type: String,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  questions: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
      questionText: String,
      idealAnswer: String,
      keywords: [String],
    },
  ],
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
      questionText: String,
      userAnswer: String,
      score: Number,
      strengths: [String],
      weaknesses: [String],
      suggestions: [String],
      idealAnswer: String,
    },
  ],
  overallScore: {
    type: Number,
    default: 0,
  },
  evaluationMethod: {
    type: String,
    enum: ['Gemini AI', 'Rule-based Fallback'],
    default: 'Rule-based Fallback',
  },
  feedback: {
    summary: String,
    overallStrengths: [String],
    overallWeaknesses: [String],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Interview', interviewSchema);
