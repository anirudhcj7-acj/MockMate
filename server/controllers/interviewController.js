const Interview = require('../models/Interview');
const Question = require('../models/Question');
const { evaluateAnswer } = require('../services/geminiService');

// @desc    Start a new interview session
// @route   POST /api/interviews/start
// @access  Private
const startInterview = async (req, res) => {
  try {
    const { category, difficulty, interviewType, totalQuestions } = req.body;

    // Fetch suitable questions from DB
    const questions = await Question.aggregate([
      { $match: { category, difficulty, type: interviewType } },
      { $sample: { size: parseInt(totalQuestions) } }
    ]);

    if (questions.length === 0) {
      // Fallback: search just by category and interview type if difficulty is too restrictive
      const fallbackQuestions = await Question.aggregate([
        { $match: { category, type: interviewType } },
        { $sample: { size: parseInt(totalQuestions) } }
      ]);

      if (fallbackQuestions.length === 0) {
        return res.status(404).json({ success: false, message: 'Not enough questions found for this configuration' });
      }

      const newInterview = await Interview.create({
        userId: req.user._id,
        category,
        difficulty,
        interviewType,
        totalQuestions: fallbackQuestions.length,
        questions: fallbackQuestions.map(q => ({
          questionId: q._id,
          questionText: q.questionText,
          idealAnswer: q.idealAnswer,
          keywords: q.keywords
        })),
        answers: [],
        completed: false
      });

      return res.status(201).json({ success: true, data: newInterview });
    }

    const newInterview = await Interview.create({
      userId: req.user._id,
      category,
      difficulty,
      interviewType,
      totalQuestions: questions.length,
      questions: questions.map(q => ({
        questionId: q._id,
        questionText: q.questionText,
        idealAnswer: q.idealAnswer,
        keywords: q.keywords
      })),
      answers: [],
      completed: false
    });

    res.status(201).json({ success: true, data: newInterview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit an interview session with answers
// @route   POST /api/interviews/:id/submit
// @access  Private
const submitInterview = async (req, res) => {
  try {
    const { answers } = req.body; // Array of { questionId, userAnswer }
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview session not found' });
    }

    if (interview.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to submit this interview' });
    }

    // Process and evaluate each answer
    const processedAnswers = [];
    let totalScore = 0;
    let evalMethod = 'Rule-based Fallback';

    for (const ans of answers) {
      const qInfo = interview.questions.find(q => q.questionId.toString() === ans.questionId);

      if (!qInfo) continue;

      const evaluation = await evaluateAnswer(
        qInfo.questionText,
        ans.userAnswer,
        qInfo.idealAnswer,
        qInfo.keywords
      );

      processedAnswers.push({
        questionId: qInfo.questionId,
        questionText: qInfo.questionText,
        userAnswer: ans.userAnswer,
        score: evaluation.score,
        strengths: evaluation.strengths,
        weaknesses: evaluation.weaknesses,
        suggestions: evaluation.suggestions,
        idealAnswer: qInfo.idealAnswer
      });

      totalScore += evaluation.score;
      if (evaluation.method === 'Gemini AI') evalMethod = 'Gemini AI';
    }

    const overallScore = Math.round(totalScore / processedAnswers.length);

    // Generate overall feedback
    const strengths = processedAnswers.flatMap(a => a.strengths).slice(0, 3);
    const weaknesses = processedAnswers.flatMap(a => a.weaknesses).slice(0, 3);

    let summary = '';
    if (overallScore >= 80) summary = 'Excellent performance! You demonstrate a strong grasp of the subject matter.';
    else if (overallScore >= 60) summary = 'Good effort. You have a solid foundation but can improve on specific technical details.';
    else summary = 'You need more practice. Focus on understanding the core concepts and using technical keywords.';

    interview.answers = processedAnswers;
    interview.overallScore = overallScore;
    interview.evaluationMethod = evalMethod;
    interview.completed = true;
    interview.feedback = {
      summary,
      overallStrengths: strengths,
      overallWeaknesses: weaknesses
    };

    await interview.save();

    res.status(200).json({ success: true, data: interview });
  } catch (error) {
    console.error('Submit Interview Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user interview history
// @route   GET /api/interviews
// @access  Private
const getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user._id, completed: true })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: interviews.length, data: interviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single interview details
// @route   GET /api/interviews/:id
// @access  Private
const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    if (interview.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({ success: true, data: interview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user._id, completed: true });

    const totalInterviews = interviews.length;
    const avgScore = totalInterviews > 0
      ? Math.round(interviews.reduce((acc, curr) => acc + curr.overallScore, 0) / totalInterviews)
      : 0;
    const bestScore = totalInterviews > 0
      ? Math.max(...interviews.map(i => i.overallScore))
      : 0;
    const totalQuestions = interviews.reduce((acc, curr) => acc + curr.totalQuestions, 0);

    // Performance by category
    const categoryStats = {};
    interviews.forEach(i => {
      if (!categoryStats[i.category]) {
        categoryStats[i.category] = { count: 0, totalScore: 0 };
      }
      categoryStats[i.category].count++;
      categoryStats[i.category].totalScore += i.overallScore;
    });

    const categoryData = Object.keys(categoryStats).map(cat => ({
      name: cat,
      avgScore: Math.round(categoryStats[cat].totalScore / categoryStats[cat].count)
    }));

    // Score history for chart
    const scoreHistory = interviews
      .slice(-10) // Last 10 interviews
      .map(i => ({
        date: new Date(i.createdAt).toLocaleDateString(),
        score: i.overallScore
      }))
      .reverse();

    res.status(200).json({
      success: true,
      data: {
        totalInterviews,
        avgScore,
        bestScore,
        questionsAnswered: totalQuestions,
        categoryPerformance: categoryData,
        scoreHistory,
        recentInterviews: interviews.slice(0, 5)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  startInterview,
  submitInterview,
  getInterviews,
  getInterviewById,
  getDashboardStats,
};
