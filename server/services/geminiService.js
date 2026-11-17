const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini if API key is provided
let genAI = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

// Rule-based fallback evaluation
const evaluateRuleBased = (questionText, userAnswer, idealAnswer, keywords) => {
  const cleanUserAnswer = userAnswer ? userAnswer.toLowerCase() : '';

  // Count matched keywords
  let matchedKeywords = 0;
  if (keywords && keywords.length > 0) {
    keywords.forEach(kw => {
      if (cleanUserAnswer.includes(kw.toLowerCase())) {
        matchedKeywords++;
      }
    });
  }

  // Calculate score based on length and keyword coverage
  let score = 40; // Base score for attempting
  if (cleanUserAnswer.length > 50) score += 20;
  if (cleanUserAnswer.length > 150) score += 10;

  if (keywords && keywords.length > 0) {
    const keywordRatio = matchedKeywords / keywords.length;
    score += Math.round(keywordRatio * 30);
  } else {
    score += 20;
  }

  if (score > 95) score = 95;
  if (score < 30) score = 30;

  const strengths = [];
  const weaknesses = [];
  const suggestions = [];

  if (matchedKeywords > 0) {
    strengths.push(`Successfully incorporated key technical terms (${matchedKeywords}/${keywords.length} keywords matched).`);
  } else {
    weaknesses.push('Missed important industry standard keywords.');
    suggestions.push(`Consider mentioning key concepts such as: ${keywords.join(', ')}.`);
  }

  if (cleanUserAnswer.length > 100) {
    strengths.push('Provided a detailed and structured explanation.');
  } else {
    weaknesses.push('Answer is a bit brief.');
    suggestions.push('Elaborate further with real-world examples or edge cases.');
  }

  suggestions.push(`Review ideal answer reference: "${idealAnswer.substring(0, 100)}..."`);

  return {
    score,
    strengths: strengths.length ? strengths : ['Attempted the question with relevant context.'],
    weaknesses: weaknesses.length ? weaknesses : ['Could be more concise and precise.'],
    suggestions: suggestions,
  };
};

// Evaluate answer using Gemini or fallback
const evaluateAnswer = async (questionText, userAnswer, idealAnswer, keywords) => {
  if (!genAI || !process.env.GEMINI_API_KEY) {
    console.log('Gemini API key not configured. Using rule-based fallback evaluation.');
    const result = evaluateRuleBased(questionText, userAnswer, idealAnswer, keywords);
    return { ...result, method: 'Rule-based Fallback' };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You are an expert technical interviewer and hiring manager. Evaluate the candidate's answer to the interview question.

Question: "${questionText}"
Ideal Answer: "${idealAnswer}"
Key Concepts/Keywords: ${JSON.stringify(keywords)}
Candidate's Answer: "${userAnswer}"

Provide your evaluation strictly in valid JSON format with the following keys:
{
  "score": <number between 0 and 100>,
  "strengths": [<array of 2 short strings describing strengths>],
  "weaknesses": [<array of 2 short strings describing missing or weak points>],
  "suggestions": [<array of 2 constructive suggestions for improvement>]
}
`;

    const response = await model.generateContent(prompt);
    const text = response.response.text();

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        score: typeof parsed.score === 'number' ? parsed.score : 70,
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ['Good technical understanding.'],
        weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : ['Could add more depth.'],
        suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : ['Practice more coding examples.'],
        method: 'Gemini AI',
      };
    } else {
      throw new Error('Failed to parse JSON from Gemini response');
    }
  } catch (error) {
    console.error('Gemini API error, falling back to rule-based:', error.message);
    const result = evaluateRuleBased(questionText, userAnswer, idealAnswer, keywords);
    return { ...result, method: 'Rule-based Fallback' };
  }
};

module.exports = {
  evaluateAnswer,
};
