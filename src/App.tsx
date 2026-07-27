/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './components/LandingPage';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { ReportIssue } from './components/ReportIssue';
import { TrackIssue } from './components/TrackIssue';
import { Leaderboard } from './components/Leaderboard';
import { Announcements } from './components/Announcements';
import { AdminPortal } from './components/AdminPortal';
import { Menu, X, LayoutDashboard, ClipboardList, Search, Award, Volume2, Shield, LogOut, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function AppContent() {
  const { currentUser, logout } = useApp();
  const [view, setView] = useState<string>('landing');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [trackPrefillId, setTrackPrefillId] = useState<string>('');

  const navigateTo = (newView: string, prefillId?: string) => {
    setIsDrawerOpen(false);
    
    // Check for track prefill ID
    if (newView.startsWith('track:')) {
      const id = newView.split(':')[1];
      setTrackPrefillId(id);
      setView('track');
      return;
    }

    if (prefillId) {
      setTrackPrefillId(prefillId);
    } else if (newView === 'track') {
      setTrackPrefillId('');
    }

    // Auth gating
    if (!currentUser && ['dashboard', 'report-issue', 'leaderboard', 'announcements', 'admin-portal'].includes(newView)) {
      setView('auth');
    } else {
      setView(newView);
    }
  };

  const handleLogout = () => {
    logout();
    setView('landing');
    setIsDrawerOpen(false);
  };

  const renderActiveView = () => {
    switch (view) {
      case 'landing':
        return <LandingPage onNavigate={navigateTo} onLoginClick={() => setView('auth')} />;
      case 'auth':
        return <Auth onSuccess={() => setView('dashboard')} />;
      case 'dashboard':
        return <Dashboard onNavigate={navigateTo} />;
      case 'report-issue':
        return <ReportIssue onSuccess={(id) => navigateTo(`track:${id}`)} />;
      case 'track':
        return <TrackIssue prefillId={trackPrefillId} onNavigate={navigateTo} />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'announcements':
        return <Announcements />;
      case 'admin-portal':
        return <AdminPortal onNavigateToTrack={(id) => navigateTo(`track:${id}`)} />;
      default:
        return <LandingPage onNavigate={navigateTo} onLoginClick={() => setView('auth')} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative text-slate-800">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigateTo('landing')}
            className="flex items-center gap-2 text-left cursor-pointer focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-900 text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
              RX
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-base block tracking-tight">ResolveX</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block -mt-1">Civic Issue Reporting</span>
            </div>
          </button>
        </div>

        {/* Right Nav Action */}
        <div className="flex items-center gap-3">
          {/* Quick status button or login */}
          {!currentUser ? (
            <button
              onClick={() => setView('auth')}
              className="hidden sm:inline-flex bg-blue-900 text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-blue-800 transition cursor-pointer"
            >
              Sign In
            </button>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {currentUser.name}
            </span>
          )}

          {/* Drawer Hamburger Selector */}
          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition cursor-pointer text-slate-600 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isDrawerOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Slide-out Navigation Drawer Menu */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />

            {/* Sidebar drawer content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white z-50 shadow-2xl border-l border-slate-100 flex flex-col"
            >
              {/* Drawer Header with Close Button */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-base">ResolveX Menu</span>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* User Profile Card inside Drawer (Matches page 3/8) */}
              {currentUser && (
                <div className="p-5 bg-slate-50 border-b border-slate-200/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-sm border border-blue-200">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm leading-snug">{currentUser.name}</h4>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mt-0.5">
                        {currentUser.role === 'admin' ? '🏛️ City Admin' : '👤 Citizen'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Items */}
              <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
                {/* Guest links */}
                <button
                  onClick={() => navigateTo('landing')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition text-left cursor-pointer ${
                    view === 'landing' ? 'bg-blue-50 text-blue-800' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  🏠 Welcome Home
                </button>

                {/* Authenticated views (Auto gate redirects to auth if clicked as guest) */}
                <button
                  onClick={() => navigateTo('dashboard')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition text-left cursor-pointer ${
                    view === 'dashboard' ? 'bg-blue-50 text-blue-800' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </button>

                <button
                  onClick={() => navigateTo('report-issue')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition text-left cursor-pointer ${
                    view === 'report-issue' ? 'bg-blue-50 text-blue-800' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <ClipboardList size={16} />
                  Report Issue
                </button>

                <button
                  onClick={() => navigateTo('track')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition text-left cursor-pointer ${
                    view === 'track' ? 'bg-blue-50 text-blue-800' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Search size={16} />
                  Track Issue
                </button>

                <button
                  onClick={() => navigateTo('leaderboard')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition text-left cursor-pointer ${
                    view === 'leaderboard' ? 'bg-blue-50 text-blue-800' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Award size={16} />
                  Leaderboard
                </button>

                <button
                  onClick={() => navigateTo('announcements')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition text-left cursor-pointer ${
                    view === 'announcements' ? 'bg-blue-50 text-blue-800' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Volume2 size={16} />
                  Announcements
                </button>

                {/* Admin Portal link */}
                {currentUser?.role === 'admin' && (
                  <button
                    onClick={() => navigateTo('admin-portal')}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition text-left cursor-pointer ${
                      view === 'admin-portal' ? 'bg-indigo-50 text-indigo-800' : 'text-indigo-600 hover:bg-indigo-50/50'
                    }`}
                  >
                    <Shield size={16} />
                    Admin Portal
                  </button>
                )}
              </nav>

              {/* Drawer Footer with Logout or Login Button */}
              <div className="p-5 border-t border-slate-100 bg-slate-50/50">
                {currentUser ? (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                ) : (
                  <button
                    onClick={() => navigateTo('auth')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-900 hover:bg-blue-850 transition cursor-pointer"
                  >
                    Sign In
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main View Area with simple entry animation */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.18 }}
            className="w-full"
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
