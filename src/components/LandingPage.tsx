import React, { useState } from 'react';
import { ShieldCheck, MapPin, CheckCircle, FileText, ArrowRight, Activity, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onNavigate: (view: string, prefillId?: string) => void;
  onLoginClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onLoginClick }) => {
  const [trackId, setTrackId] = useState('');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackId.trim()) {
      onNavigate('track', trackId.trim().toUpperCase());
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {/* Hero Section */}
      <section className="relative px-6 py-12 md:py-24 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 overflow-hidden">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
        
        <div className="flex-1 text-center lg:text-left space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border border-blue-100"
          >
            <Sparkles size={14} className="text-blue-500" />
            Empowering Transparent Governance
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight"
          >
            Bridge the gap between <span className="text-blue-700">Citizens</span> & <span className="text-indigo-600">City Authorities</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
          >
            ResolveX is a collaborative civic-governance portal that lets you report local infrastructure, safety, and utility issues, tracking them transparently through to resolution.
          </motion.p>

          {/* Quick Track Input */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-md mx-auto lg:mx-0 bg-white p-2 rounded-xl shadow-md border border-slate-200/80 flex items-center gap-2"
          >
            <form onSubmit={handleTrackSubmit} className="flex w-full items-center">
              <FileText size={20} className="text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={trackId}
                onChange={(e) => setTrackId(e.target.value)}
                placeholder="Enter Track ID (e.g. RX-1042)"
                className="w-full px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none text-sm font-medium"
              />
              <button
                type="submit"
                className="bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition shadow-sm cursor-pointer shrink-0"
              >
                Track
              </button>
            </form>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
          >
            <button
              onClick={() => onNavigate('dashboard')}
              className="bg-slate-900 text-white px-6 py-3 rounded-xl text-base font-semibold hover:bg-slate-800 transition flex items-center gap-2 shadow-md cursor-pointer"
            >
              Get Started
              <ArrowRight size={18} />
            </button>
            <button
              onClick={onLoginClick}
              className="bg-white text-slate-700 px-6 py-3 rounded-xl text-base font-semibold border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
            >
              Access Demo Accounts
            </button>
          </motion.div>
        </div>

        {/* Hero Visual Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-100 p-6 space-y-6 relative"
        >
          {/* Overlay Status Badge */}
          <div className="absolute -top-3 -right-3 bg-emerald-500 text-white font-semibold text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1 animate-bounce">
            <CheckCircle size={12} /> Resolved
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
              RX
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Smart Civic Portal</h3>
              <p className="text-xs text-slate-500">Live Status Tracker</p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Roads & Transport</span>
              <span className="text-slate-500">June 24, 2026</span>
            </div>
            <h4 className="font-bold text-slate-800 text-base">Massive pothole blocking left lane</h4>
            <p className="text-xs text-slate-600 line-clamp-2">
              Large pothole formed over the weekend causing major traffic slowdown on 5th Avenue. Water is accumulating inside the hole.
            </p>
            <div className="flex items-center gap-1 text-slate-500 text-xs">
              <MapPin size={12} className="text-rose-500" />
              <span>5th Avenue near Metro Station</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs text-slate-500 font-medium px-1">
              <span>Resolution Progress</span>
              <span className="text-emerald-600 font-bold">100%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full w-full"></div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[10px] text-center text-slate-500">
              <div className="bg-blue-50 text-blue-700 py-1 rounded font-semibold">1. Reported</div>
              <div className="bg-indigo-50 text-indigo-700 py-1 rounded font-semibold">2. Dispatched</div>
              <div className="bg-emerald-50 text-emerald-700 py-1 rounded font-semibold">3. Solved</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Metrics Section */}
      <section className="bg-white border-y border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center space-y-2">
            <p className="text-4xl font-extrabold text-blue-700">98%</p>
            <p className="text-sm font-bold text-slate-800 uppercase tracking-wider">Resolution Rate</p>
            <p className="text-xs text-slate-500">Consistent action on all valid reported issues</p>
          </div>
          <div className="text-center space-y-2">
            <p className="text-4xl font-extrabold text-blue-700">&lt; 24h</p>
            <p className="text-sm font-bold text-slate-800 uppercase tracking-wider">Average Dispatch</p>
            <p className="text-xs text-slate-500">Crews sent to inspect and plan repairs</p>
          </div>
          <div className="text-center space-y-2">
            <p className="text-4xl font-extrabold text-blue-700">4,200+</p>
            <p className="text-sm font-bold text-slate-800 uppercase tracking-wider">Active Residents</p>
            <p className="text-xs text-slate-500">Reporting and contributing to neighborhood safety</p>
          </div>
          <div className="text-center space-y-2">
            <p className="text-4xl font-extrabold text-blue-700">100%</p>
            <p className="text-sm font-bold text-slate-800 uppercase tracking-wider">Transparent Updates</p>
            <p className="text-xs text-slate-500">Track and view exact municipal notes</p>
          </div>
        </div>
      </section>

      {/* Core Features Pillars */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900">How ResolveX Works</h2>
          <p className="text-slate-600">
            A simplified, three-step collaborative platform connecting community needs with rapid government response.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/70 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <MapPin size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">1. Spot and Report</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Identify local issues such as broken street lamps, deep potholes, overflowing waste bins, or safety concerns. Take a photo, provide the location, and submit under 2 minutes.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/70 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Activity size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">2. Track in Real-Time</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Every report receives an official tracking ID (`RX-####`). Citizens can lookup progress tags like Under Review, In Progress, or Resolved, complete with transparent municipal comments.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/70 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">3. Build Community Impact</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Earn impact points for reporting critical safety and utility issues. Climb the local Civic Leaderboard and join a cohort of recognized citizens active in transforming our city.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Spotlight */}
      <section className="bg-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Priority Categories We Manage</h2>
              <p className="text-slate-600 text-sm mt-2">Crews are specifically designated to react to these report channels:</p>
            </div>
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-blue-700 font-semibold text-sm flex items-center gap-1 hover:text-blue-800 transition cursor-pointer"
            >
              Submit a Report <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { title: 'Roads & Potholes', desc: 'Potholes, cracks, blockages', color: 'bg-amber-500' },
              { title: 'Water Supply', desc: 'Leaks, supply, contamination', color: 'bg-sky-500' },
              { title: 'Waste Management', desc: 'Overflow bins, illegal dumping', color: 'bg-emerald-500' },
              { title: 'Street Lighting', desc: 'Flickering bulbs, dark pathways', color: 'bg-indigo-500' },
              { title: 'Public Safety', desc: 'Hazardous spots, fallen trees', color: 'bg-rose-500' },
            ].map((cat, idx) => (
              <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className={`w-3 h-3 rounded-full ${cat.color}`}></div>
                <h4 className="font-bold text-slate-800 text-sm">{cat.title}</h4>
                <p className="text-xs text-slate-500 leading-normal">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-extrabold text-xs">
              RX
            </div>
            <span className="font-bold text-white text-base">ResolveX Portal</span>
          </div>
          <p className="text-xs text-slate-500">© 2026 ResolveX Municipal Corporation. All rights reserved.</p>
          <div className="flex gap-4 text-xs">
            <span className="hover:text-white transition cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
