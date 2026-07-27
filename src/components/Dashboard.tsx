import React from 'react';
import { useApp } from '../context/AppContext';
import { ClipboardList, Clock, CheckCircle, Volume2, ArrowRight, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  onNavigate: (view: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { currentUser, reports, announcements } = useApp();

  // Calculate metrics
  const totalReports = reports.length;
  const pendingReports = reports.filter(r => r.status !== 'Resolved').length;
  const resolvedReports = reports.filter(r => r.status === 'Resolved').length;

  // Format dates elegantly
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const day = d.getDate();
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const month = months[d.getMonth()];
      const year = d.getFullYear();
      return `${day} ${month} ${year}`;
    } catch {
      return dateStr;
    }
  };

  // Get status class for badge styling
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Submitted':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Under Review':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'In Progress':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {currentUser?.name || 'Resident'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Here's an overview of civic activity in your area.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('report-issue')}
            className="bg-blue-900 text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-blue-850 transition shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <ClipboardList size={16} />
            Report Issue
          </button>
          <button
            onClick={() => onNavigate('track')}
            className="bg-white text-slate-700 font-semibold text-sm px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5"
          >
            Track Issue
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Reports */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm flex items-center justify-between"
        >
          <div className="space-y-2">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider block">Total Reports</span>
            <span className="text-3xl font-extrabold text-slate-900 block">{totalReports}</span>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center border border-blue-100/50">
            <ClipboardList size={22} />
          </div>
        </motion.div>

        {/* Pending Reports */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm flex items-center justify-between"
        >
          <div className="space-y-2">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider block">Pending Reports</span>
            <span className="text-3xl font-extrabold text-slate-900 block">{pendingReports}</span>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center border border-amber-100/50">
            <Clock size={22} />
          </div>
        </motion.div>

        {/* Resolved Reports */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm flex items-center justify-between"
        >
          <div className="space-y-2">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider block">Resolved Reports</span>
            <span className="text-3xl font-extrabold text-emerald-600 block">{resolvedReports}</span>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100/50">
            <CheckCircle size={22} />
          </div>
        </motion.div>
      </div>

      {/* Main Grid: Recent Issues and Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Issues List (Takes 2/3 of grid width on desktop) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-extrabold text-slate-900">Recent Issues</h2>
            <button
              onClick={() => onNavigate('track')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-850 hover:underline cursor-pointer"
            >
              View all
            </button>
          </div>

          <div className="space-y-3">
            {reports.length === 0 ? (
              <div className="bg-white p-8 text-center rounded-2xl border border-slate-200/60 text-slate-500 text-sm">
                No reports submitted yet. Be the first to file one!
              </div>
            ) : (
              reports.slice(0, 4).map((report, idx) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => onNavigate(`track:${report.id}`)}
                  className="bg-white p-4 rounded-xl border border-slate-200/80 hover:border-slate-300 shadow-sm transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:shadow-md"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
                      <span className="font-bold text-slate-700">{report.id}</span>
                      <span>•</span>
                      <span>{report.category}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                      {report.title}
                    </h3>
                    <div className="flex items-center gap-1 text-slate-400 text-xs">
                      <MapPin size={12} className="text-rose-500" />
                      <span>{report.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0">
                    <span className="text-xs text-slate-400 sm:hidden block">
                      {formatDate(report.createdAt)}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(report.status)}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {report.status}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Announcements Widget (Takes 1/3 of grid width on desktop) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-1.5">
              <Volume2 size={18} className="text-blue-700" />
              Announcements
            </h2>
            <button
              onClick={() => onNavigate('announcements')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-850 hover:underline flex items-center gap-1 cursor-pointer"
            >
              All <ArrowRight size={14} />
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {announcements.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">
                No announcements posted yet.
              </div>
            ) : (
              announcements.slice(0, 3).map((ann, idx) => (
                <div key={ann.id} className="p-5 hover:bg-slate-50/50 transition space-y-2">
                  <h3 className="font-extrabold text-slate-900 text-sm leading-tight">
                    {ann.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {ann.content}
                  </p>
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                    {formatDate(ann.createdAt)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
