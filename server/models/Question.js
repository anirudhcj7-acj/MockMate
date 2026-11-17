const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
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
    ],
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
  },
  type: {
    type: String,
    required: true,
    enum: ['Technical', 'HR'],
    default: 'Technical'
  },
  idealAnswer: {
    type: String,
    required: true,
  },
  keywords: {
    type: [String],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Question', questionSchema);
