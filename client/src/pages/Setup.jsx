import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';
import { Code2, BookOpen, Layers, Zap } from 'lucide-react';

export default function Setup() {
  const [category, setCategory] = useState('JavaScript');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [interviewType, setInterviewType] = useState('Technical');
  const navigate = useNavigate();

  const categories = [
    'JavaScript', 'React.js', 'Node.js', 'MongoDB', 'HTML & CSS',
    'DBMS', 'Operating Systems', 'Computer Networks', 'Data Structures and Algorithms', 'HR Interview'
  ];

  const handleStart = async () => {
    try {
      const res = await api.post('/interviews/start', {
        category,
        difficulty,
        interviewType,
        totalQuestions
      });
      navigate(`/interview/${res.data.data._id}`);
    } catch (err) {
      console.error('Failed to start interview:', err);
      alert('Could not start interview. Check if enough questions exist.');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Setup New Interview</h1>

        <div className="bg-card-bg border border-white/10 p-8 rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-3">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-secondary-bg border border-white/10 p-4 rounded-xl text-text-primary focus:border-primary transition-all appearance-none"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-3">Interview Type</label>
              <div className="flex gap-2">
                {['Technical', 'HR'].map(type => (
                  <button
                    key={type}
                    onClick={() => setInterviewType(type)}
                    className={`flex-1 p-4 rounded-xl border transition-all ${interviewType === type ? 'bg-primary text-white border-primary' : 'bg-secondary-bg border-white/10 text-text-secondary hover:border-white/20'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Selection */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-3">Difficulty</label>
              <div className="flex gap-2">
                {['Beginner', 'Intermediate', 'Advanced'].map(diff => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`flex-1 p-4 rounded-xl border transition-all ${difficulty === diff ? 'bg-highlight/20 text-highlight border-highlight' : 'bg-secondary-bg border-white/10 text-text-secondary hover:border-white/20'}`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count Selection */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-3">Number of Questions</label>
              <div className="flex gap-2">
                {[5, 10].map(num => (
                  <button
                    key={num}
                    onClick={() => setTotalQuestions(num)}
                    className={`flex-1 p-4 rounded-xl border transition-all ${totalQuestions === num ? 'bg-secondary-bg border-white/30 text-text-primary' : 'bg-secondary-bg border-white/10 text-text-secondary'}`}
                  >
                    {num} Questions
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleStart}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg shadow-lg shadow-primary/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
          >
            Start Interview <Zap className="w-5 h-5" />
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
