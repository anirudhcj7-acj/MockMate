import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Sparkles, ArrowRight, CheckCircle2, Cpu, BarChart2, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-primary selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/15 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-elevated/80 border border-white/10 text-highlight text-xs font-semibold mb-6 shadow-inner"
          >
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen AI Interview Preparation
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight mb-6"
          >
            Your Next Interview <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-highlight bg-clip-text text-transparent">
              Starts Here.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Practice real-world technical and HR interview questions, get intelligent AI feedback, and build the confidence to land your dream job.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-3">
              Start Practicing <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#features" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-card-bg hover:bg-elevated border border-white/10 text-text-primary font-semibold transition-all flex items-center justify-center gap-2">
              Explore Platform
            </a>
          </motion.div>

          {/* Dashboard Preview Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-5xl mx-auto rounded-2xl border border-white/10 bg-card-bg/80 backdrop-blur-xl shadow-2xl p-4 md:p-6"
          >
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-2 text-xs text-text-secondary font-mono">mockmate.app/dashboard</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[
                { title: 'Total Interviews', value: '12', change: '+2 this week' },
                { title: 'Average Score', value: '88%', change: '+5.4%' },
                { title: 'Best Score', value: '96%', change: 'React.js' },
                { title: 'Questions Mastered', value: '64', change: 'Top 10%' },
              ].map((stat, i) => (
                <div key={i} className="bg-secondary-bg/60 border border-white/5 p-4 rounded-xl text-left">
                  <p className="text-xs text-text-secondary mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-text-primary mb-1">{stat.value}</h3>
                  <span className="text-xs text-success">{stat.change}</span>
                </div>
              ))}
            </div>
            <div className="h-48 bg-secondary-bg/40 rounded-xl border border-white/5 flex items-center justify-center text-text-secondary font-mono text-sm">
              [ Interactive Performance Analytics Chart ]
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative bg-secondary-bg/30 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Engineered for Perfection</h2>
            <p className="text-text-secondary">Everything you need to master technical interviews and communicate with confidence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Cpu,
                title: 'AI Answer Evaluation',
                description: 'Get instant, detailed analysis on correctness, clarity, and keyword coverage powered by Gemini AI.'
              },
              {
                icon: Zap,
                title: 'Personalized Mock Sessions',
                description: 'Choose your tech stack, difficulty, and question count for tailored practice.'
              },
              {
                icon: BarChart2,
                title: 'Performance Analytics',
                description: 'Track your score progression over time with interactive Recharts graphs and category breakdowns.'
              },
              {
                icon: ShieldCheck,
                title: 'Robust Fallback Engine',
                description: 'Never get stuck. If AI is offline, our rule-based evaluation engine takes over seamlessly.'
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="bg-card-bg border border-white/10 p-6 rounded-2xl hover:border-primary/50 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-text-primary">{feature.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How MockMate Works</h2>
            <p className="text-text-secondary">Four simple steps to transform your interview readiness.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Choose Interview', desc: 'Select your target tech stack (React, Node, DSA, etc.) and difficulty.' },
              { step: '02', title: 'Answer Questions', desc: 'Respond to real-world interview questions in a distraction-free room.' },
              { step: '03', title: 'Receive AI Feedback', desc: 'Get scored on technical correctness with strengths & ideal answers.' },
              { step: '04', title: 'Improve & Track', desc: 'Monitor your progress and master weaknesses with detailed analytics.' },
            ].map((item, i) => (
              <div key={i} className="bg-card-bg/60 border border-white/10 p-6 rounded-2xl relative">
                <span className="text-4xl font-mono font-extrabold text-primary/30 mb-4 block">{item.step}</span>
                <h3 className="text-lg font-semibold mb-2 text-text-primary">{item.title}</h3>
                <p className="text-sm text-text-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-secondary-bg/50 text-center text-sm text-text-secondary">
        <p>© 2026 MockMate. Built with MERN Stack & Gemini AI for engineering students.</p>
      </footer>
    </div>
  );
}
