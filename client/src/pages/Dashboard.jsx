import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Trophy,
  Target,
  CheckCircle,
  HelpCircle,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Calendar,
  Sparkles
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/interviews/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <DashboardLayout>
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-gradient-to-r from-card-bg to-secondary-bg border border-white/10 p-6 rounded-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            Welcome back, <span className="text-primary">{user?.name}</span> 👋
          </h1>
          <p className="text-sm text-text-secondary">Ready to boost your performance with AI mock practice?</p>
        </div>
        <Link
          to="/setup"
          className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm transition-all shadow-lg shadow-primary/30 flex items-center gap-2 self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" /> Start New Interview
        </Link>
      </div>

      {/* Quick Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Total Interviews', value: stats?.totalInterviews || 0, icon: Target, color: 'text-primary' },
          { label: 'Average Score', value: `${stats?.avgScore || 0}%`, icon: TrendingUp, color: 'text-success' },
          { label: 'Best Score', value: `${stats?.bestScore || 0}%`, icon: Trophy, color: 'text-highlight' },
          { label: 'Questions Answered', value: stats?.questionsAnswered || 0, icon: HelpCircle, color: 'text-secondary' },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-card-bg border border-white/10 p-5 rounded-2xl relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-text-secondary">{card.label}</span>
                <div className={`p-2 rounded-xl bg-white/5 ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-text-primary">{card.value}</h2>
            </div>
          );
        })}
      </div>

      {/* Performance Overview & Recommended Practice */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Score Chart */}
        <div className="lg:col-span-2 bg-card-bg border border-white/10 p-6 rounded-2xl">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" /> Performance Overview
          </h3>
          {stats?.scoreHistory && stats.scoreHistory.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.scoreHistory}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7965F5" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#7965F5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#A6A1B8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#A6A1B8" fontSize={12} tickLine={false} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1C1A2B', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#F5F3FF' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#7965F5" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-xl">
              <Sparkles className="w-8 h-8 text-text-secondary mb-2 opacity-50" />
              <p className="text-sm text-text-secondary mb-4">No completed interview data yet.</p>
              <Link to="/setup" className="text-xs px-4 py-2 bg-primary/20 text-highlight rounded-xl hover:bg-primary/30 transition-colors">
                Take your first interview
              </Link>
            </div>
          )}
        </div>

        {/* Next Recommendation Card */}
        <div className="bg-card-bg border border-white/10 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-primary uppercase tracking-wider block mb-2">Recommended Next</span>
            <h3 className="text-xl font-bold mb-2">React.js Interview</h3>
            <p className="text-sm text-text-secondary mb-6 leading-relaxed">
              Enhance your modern web framework skills. Test your knowledge on Hooks, Virtual DOM, and State Management.
            </p>
          </div>
          <Link
            to="/setup"
            className="w-full py-3 rounded-xl bg-secondary-bg hover:bg-elevated border border-white/10 text-text-primary text-center font-medium text-sm transition-all flex items-center justify-center gap-2"
          >
            Configure Session <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-card-bg border border-white/10 p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold">Recent Interviews</h3>
          <Link to="/history" className="text-xs text-primary hover:underline font-medium">View All</Link>
        </div>

        {stats?.recentInterviews && stats.recentInterviews.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs text-text-secondary uppercase">
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Difficulty</th>
                  <th className="pb-3 font-semibold">Score</th>
                  <th className="pb-3 font-semibold">Eval Method</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {stats.recentInterviews.map((item) => (
                  <tr key={item._id} className="hover:bg-white/5 transition-colors">
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
                      <Link to={`/results/${item._id}`} className="text-xs text-primary hover:underline font-medium">
                        View Report
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-text-secondary text-center py-8">No recent activity to show.</p>
        )}
      </div>
    </DashboardLayout>
  );
}
