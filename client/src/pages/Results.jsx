import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Trophy, CheckCircle, AlertCircle, ArrowLeft, Sparkles, RefreshCw } from 'lucide-react';

export default function Results() {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get(`/interviews/${id}`);
        setInterview(res.data.data);
      } catch (err) {
        console.error('Failed to load results:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-text-primary">Loading results...</div>;
  if (!interview) return <div className="min-h-screen bg-background flex items-center justify-center text-text-primary">Results not found.</div>;

  return (
    <div className="min-h-screen bg-background text-text-primary p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-highlight">
            Evaluation: {interview.evaluationMethod}
          </span>
        </div>

        {/* Score Card Banner */}
        <div className="bg-gradient-to-r from-card-bg to-secondary-bg border border-white/10 p-8 rounded-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-2">{interview.category} • {interview.difficulty}</span>
            <h1 className="text-3xl font-bold mb-2">Interview Performance Report</h1>
            <p className="text-sm text-text-secondary max-w-xl">{interview.feedback?.summary}</p>
          </div>
          <div className="w-32 h-32 rounded-full border-4 border-primary bg-primary/10 flex flex-col items-center justify-center shrink-0 shadow-xl shadow-primary/20">
            <span className="text-3xl font-extrabold text-highlight">{interview.overallScore}%</span>
            <span className="text-xs text-text-secondary">Overall Score</span>
          </div>
        </div>

        {/* Question-by-Question Breakdown */}
        <h2 className="text-xl font-bold mb-6">Detailed Answer Feedback</h2>
        <div className="space-y-6">
          {interview.answers.map((ans, i) => (
            <div key={i} className="bg-card-bg border border-white/10 p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-text-secondary uppercase">Question {i + 1}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  ans.score >= 80 ? 'bg-green-500/10 text-green-400' :
                  ans.score >= 60 ? 'bg-yellow-500/10 text-yellow-400' :
                  'bg-red-500/10 text-red-400'
                }`}>
                  Score: {ans.score}/100
                </span>
              </div>

              <h3 className="text-lg font-bold mb-3">{ans.questionText}</h3>

              <div className="bg-secondary-bg p-4 rounded-xl mb-4 text-sm text-text-secondary">
                <strong className="text-text-primary block mb-1">Your Answer:</strong>
                {ans.userAnswer || 'No answer provided.'}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-green-500/5 border border-green-500/10 p-4 rounded-xl">
                  <h4 className="text-xs font-semibold text-green-400 uppercase mb-2">Strengths</h4>
                  <ul className="text-xs text-text-secondary space-y-1 list-disc list-inside">
                    {ans.strengths?.map((s, idx) => <li key={idx}>{s}</li>)}
                  </ul>
                </div>
                <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-xl">
                  <h4 className="text-xs font-semibold text-red-400 uppercase mb-2">Weaknesses / Areas for Improvement</h4>
                  <ul className="text-xs text-text-secondary space-y-1 list-disc list-inside">
                    {ans.weaknesses?.map((w, idx) => <li key={idx}>{w}</li>)}
                  </ul>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/10 p-4 rounded-xl text-xs text-text-secondary">
                <strong className="text-primary block mb-1">Ideal Reference Answer:</strong>
                {ans.idealAnswer}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link to="/setup" className="px-8 py-4 rounded-xl bg-primary text-white font-semibold shadow-lg shadow-primary/25 inline-flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Practice Another Interview
          </Link>
        </div>
      </div>
    </div>
  );
}
