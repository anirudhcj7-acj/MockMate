import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';
import { History as HistoryIcon, Calendar, ArrowRight, Trash2 } from 'lucide-react';

export default function History() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/interviews');
        setInterviews(res.data.data);
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Interview History</h1>
        <p className="text-sm text-text-secondary">Review all your past completed interview sessions and detailed performance.</p>
      </div>

      <div className="bg-card-bg border border-white/10 rounded-2xl p-6">
        {loading ? (
          <p className="text-center text-text-secondary py-8">Loading history...</p>
        ) : interviews.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs text-text-secondary uppercase">
                  <th className="pb-4 font-semibold">Date</th>
                  <th className="pb-4 font-semibold">Category</th>
                  <th className="pb-4 font-semibold">Difficulty</th>
                  <th className="pb-4 font-semibold">Score</th>
                  <th className="pb-4 font-semibold">Method</th>
                  <th className="pb-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {interviews.map((item) => (
                  <tr key={item._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 text-text-secondary text-xs">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 font-medium">{item.category}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-400' :
                        item.difficulty === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {item.difficulty}
                      </span>
                    </td>
                    <td className="py-4 font-bold text-highlight">{item.overallScore}%</td>
                    <td className="py-4 text-xs text-text-secondary">{item.evaluationMethod}</td>
                    <td className="py-4 text-right">
                      <Link to={`/results/${item._id}`} className="text-xs text-primary hover:underline font-medium inline-flex items-center gap-1">
                        View Report <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <HistoryIcon className="w-12 h-12 text-text-secondary mx-auto mb-4 opacity-50" />
            <p className="text-text-secondary mb-4">No interview history found.</p>
            <Link to="/setup" className="px-6 py-3 bg-primary text-white rounded-xl text-sm font-semibold shadow-lg shadow-primary/20">
              Start Your First Interview
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
