import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';
import { BarChart3, TrendingUp, Trophy } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/interviews/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Performance Analytics</h1>
        <p className="text-sm text-text-secondary">Comprehensive insights into your category-wise strengths and score trends.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Category Performance Bar Chart */}
        <div className="bg-card-bg border border-white/10 p-6 rounded-2xl">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" /> Category-wise Average Scores
          </h3>
          {stats?.categoryPerformance && stats.categoryPerformance.length > 0 ? (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.categoryPerformance}>
                  <XAxis dataKey="name" stroke="#A6A1B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#A6A1B8" fontSize={12} tickLine={false} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1C1A2B', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#F5F3FF' }}
                  />
                  <Bar dataKey="avgScore" fill="#7965F5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-text-secondary text-center py-16">No category data available yet.</p>
          )}
        </div>

        {/* Quick Summary Cards */}
        <div className="space-y-6">
          <div className="bg-card-bg border border-white/10 p-6 rounded-2xl">
            <h3 className="text-sm font-semibold text-text-secondary uppercase mb-2">Overall Readiness Score</h3>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-extrabold text-highlight">{stats?.avgScore || 0}%</span>
              <span className="text-xs text-success font-medium">Based on {stats?.totalInterviews || 0} completed interviews</span>
            </div>
          </div>

          <div className="bg-card-bg border border-white/10 p-6 rounded-2xl">
            <h3 className="text-sm font-semibold text-text-secondary uppercase mb-2">Total Questions Answered</h3>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-extrabold text-primary">{stats?.questionsAnswered || 0}</span>
              <span className="text-xs text-text-secondary">Across all tech stacks</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
