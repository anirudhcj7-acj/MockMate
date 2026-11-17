const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('../models/Question');

dotenv.config();

const questions = [
  {
    questionText: 'What is the difference between "var", "let", and "const" in JavaScript?',
    category: 'JavaScript',
    difficulty: 'Beginner',
    type: 'Technical',
    idealAnswer: 'var is function-scoped, let and const are block-scoped. const variables cannot be reassigned.',
    keywords: ['scope', 'var', 'let', 'const', 'block-scoped', 'function-scoped', 'reassigned']
  },
  {
    questionText: 'Explain the concept of React hooks.',
    category: 'React.js',
    difficulty: 'Intermediate',
    type: 'Technical',
    idealAnswer: 'Hooks are functions that let you "hook into" React state and lifecycle features from function components.',
    keywords: ['hooks', 'function components', 'state', 'lifecycle', 'useState', 'useEffect']
  },
  {
    questionText: 'What are the main advantages of using MongoDB over traditional RDBMS?',
    category: 'MongoDB',
    difficulty: 'Beginner',
    type: 'Technical',
    idealAnswer: 'MongoDB is a NoSQL database, which is schema-less, highly scalable, and flexible for unstructured data.',
    keywords: ['NoSQL', 'schema-less', 'scalable', 'flexible', 'unstructured']
  },
  {
    questionText: 'What is the role of a middleware in Express.js?',
    category: 'Node.js',
    difficulty: 'Intermediate',
    type: 'Technical',
    idealAnswer: 'Middleware functions have access to the request object, response object, and next function in the request-response cycle.',
    keywords: ['middleware', 'request-response cycle', 'Express', 'next function']
  },
  {
    questionText: 'Tell me about yourself.',
    category: 'HR Interview',
    difficulty: 'Beginner',
    type: 'HR',
    idealAnswer: 'I am a passionate software developer with a strong interest in full-stack development and solving real-world problems.',
    keywords: ['passionate', 'software developer', 'full-stack', 'problem-solving']
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mockmate');
    await Question.deleteMany({});
    await Question.insertMany(questions);
    console.log('Database seeded!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDB();
