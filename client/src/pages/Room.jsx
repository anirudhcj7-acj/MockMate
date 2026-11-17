import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, ArrowRight, CheckCircle, Clock, ShieldAlert } from 'lucide-react';

export default function Room() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await api.get(`/interviews/${id}`);
        setInterview(res.data.data);
      } catch (err) {
        console.error('Failed to load interview session:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterview();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-text-primary">Loading session...</div>;
  if (!interview) return <div className="min-h-screen bg-background flex items-center justify-center text-text-primary">Interview not found.</div>;

  const currentQ = interview.questions[currentIndex];

  const handleAnswerChange = (e) => {
    setAnswers({
      ...answers,
      [currentQ.questionId]: e.target.value
    });
  };

  const handleSubmit = async () => {
    if (!window.confirm('Are you sure you want to submit your answers?')) return;

    setSubmitting(true);
    try {
      const formattedAnswers = interview.questions.map(q => ({
        questionId: q.questionId,
        userAnswer: answers[q.questionId] || ''
      }));

      await api.post(`/interviews/${id}/submit`, { answers: formattedAnswers });
      navigate(`/results/${id}`);
    } catch (err) {
      console.error('Failed to submit interview:', err);
      alert('Error submitting interview. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary p-6 flex flex-col justify-between">
      {/* Top Bar */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <span className="text-xs text-text-secondary uppercase tracking-wider">{interview.category} • {interview.difficulty}</span>
          <h2 className="text-xl font-bold">Mock Session</h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-highlight">Question {currentIndex + 1} of {interview.questions.length}</span>
        </div>
      </header>

      {/* Main Question & Answer Editor */}
      <main className="max-w-4xl mx-auto w-full my-8 flex-1">
        <div className="bg-card-bg border border-white/10 p-8 rounded-2xl mb-6">
          <h3 className="text-2xl font-bold mb-4">{currentQ?.questionText}</h3>

          <textarea
            value={answers[currentQ?.questionId] || ''}
            onChange={handleAnswerChange}
            placeholder="Type your structured answer here. Be as clear and detailed as possible..."
            className="w-full h-64 bg-secondary-bg border border-white/10 rounded-xl p-4 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-primary transition-all resize-none text-base"
          />
        </div>
      </main>

      {/* Navigation & Controls */}
      <footer className="max-w-4xl mx-auto w-full flex items-center justify-between border-t border-white/10 pt-4">
        <button
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(currentIndex - 1)}
          className="px-6 py-3 rounded-xl bg-card-bg border border-white/10 text-text-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Previous
        </button>

        {currentIndex === interview.questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-8 py-3 rounded-xl bg-success text-background font-bold flex items-center gap-2 shadow-lg shadow-success/20 hover:opacity-90"
          >
            {submitting ? 'Evaluating...' : 'Submit Interview'} <CheckCircle className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={() => setCurrentIndex(currentIndex + 1)}
            className="px-6 py-3 rounded-xl bg-primary text-white font-semibold flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </footer>
    </div>
  );
}
