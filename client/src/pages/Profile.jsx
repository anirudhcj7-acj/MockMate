import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Mail, Lock, CheckCircle } from 'lucide-react';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const payload = { name };
      if (password) payload.password = password;

      const res = await api.put('/users/profile', payload);
      setUser(res.data);
      setSuccess('Profile updated successfully!');
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">User Profile</h1>
        <p className="text-sm text-text-secondary mb-8">Manage your account information and preferences.</p>

        <div className="bg-card-bg border border-white/10 p-8 rounded-2xl">
          {success && (
            <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" /> {success}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-text-secondary" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-secondary-bg border border-white/10 rounded-xl px-12 py-3 text-text-primary focus:border-primary transition-colors text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Email Address (Read-only)</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-text-secondary" />
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full bg-secondary-bg/50 border border-white/5 rounded-xl px-12 py-3 text-text-secondary cursor-not-allowed text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">New Password (leave blank to keep current)</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-text-secondary" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-secondary-bg border border-white/10 rounded-xl px-12 py-3 text-text-primary focus:border-primary transition-colors text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="py-3 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold transition-all shadow-lg shadow-primary/25 text-sm"
            >
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
