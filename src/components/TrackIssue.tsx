import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Search, MapPin, Calendar, Clock, User, Eye, ArrowLeft, ShieldAlert, CheckCircle, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { IssueStatus } from '../types';

interface TrackIssueProps {
  prefillId?: string;
  onNavigate: (view: string) => void;
}

export const TrackIssue: React.FC<TrackIssueProps> = ({ prefillId, onNavigate }) => {
  const { reports, currentUser, updateReportStatus } = useApp();
  const [searchId, setSearchId] = useState(prefillId || '');
  const [activeReport, setActiveReport] = useState<typeof reports[0] | null>(null);
  const [adminStatusInput, setAdminStatusInput] = useState<IssueStatus>('Submitted');
  const [statusMessage, setStatusMessage] = useState('');

  // Handle prefill on load
  useEffect(() => {
    if (prefillId) {
      const found = reports.find(r => r.id.toLowerCase() === prefillId.toLowerCase());
      if (found) {
        setActiveReport(found);
        setAdminStatusInput(found.status);
      }
    }
  }, [prefillId, reports]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage('');
    if (!searchId.trim()) return;

    const found = reports.find(
      r => r.id.toLowerCase() === searchId.trim().toLowerCase()
    );

    if (found) {
      setActiveReport(found);
      setAdminStatusInput(found.status);
    } else {
      setActiveReport(null);
      setStatusMessage('No issue found with that tracking ID.');
    }
  };

  const handleQuickClick = (id: string) => {
    setStatusMessage('');
    const found = reports.find(r => r.id === id);
    if (found) {
      setActiveReport(found);
      setSearchId(id);
      setAdminStatusInput(found.status);
    }
  };

  const handleAdminStatusSubmit = () => {
    if (!activeReport) return;
    updateReportStatus(activeReport.id, adminStatusInput);
    // update state locally too
    setActiveReport(prev => prev ? { ...prev, status: adminStatusInput, updatedAt: new Date().toISOString() } : null);
    setStatusMessage(`Status updated to "${adminStatusInput}" successfully.`);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  // Status Badge Class
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

  // Formatted date
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  // Progressive steps representation
  const steps: { name: IssueStatus; desc: string }[] = [
    { name: 'Submitted', desc: 'Report received by system' },
    { name: 'Under Review', desc: 'Municipality reviewing reports' },
    { name: 'In Progress', desc: 'Workforce dispatched to field' },
    { name: 'Resolved', desc: 'Issue cleared & verified' }
  ];

  const getStepIndex = (status: IssueStatus) => {
    if (status === 'Submitted') return 0;
    if (status === 'Under Review') return 1;
    if (status === 'In Progress') return 2;
    if (status === 'Resolved') return 3;
    return 0;
  };

  const currentStepIdx = activeReport ? getStepIndex(activeReport.status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Search Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Track an issue
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Enter your Issue ID (e.g. RX-1042) to see real-time status.
          </p>
        </div>

        {/* Search Bar Form */}
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1 rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400" />
            </div>
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="e.g. RX-1042"
              className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition text-sm font-semibold uppercase"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-850 transition text-sm shadow-sm cursor-pointer"
          >
            Search
          </button>
        </form>

        {statusMessage && !activeReport && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
            <ShieldAlert size={16} className="mt-0.5 shrink-0 text-amber-600" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {activeReport ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs bg-blue-600 text-white px-2.5 py-0.5 rounded-md font-extrabold uppercase tracking-wider">
                  {activeReport.category}
                </span>
                <span className="text-xs text-slate-400 font-mono font-bold">
                  ID: {activeReport.id}
                </span>
              </div>
              <h2 className="text-xl font-black">{activeReport.title}</h2>
            </div>
            
            <div className="shrink-0 flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(activeReport.status)}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                {activeReport.status}
              </span>
              <button
                onClick={() => {
                  setActiveReport(null);
                  setSearchId('');
                }}
                className="text-slate-400 hover:text-white p-1 text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Interactive Progress bar */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resolution Pipeline</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {steps.map((step, idx) => {
                  const isDone = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;
                  return (
                    <div
                      key={step.name}
                      className={`p-4 rounded-xl border flex flex-col justify-between min-h-[90px] transition ${
                        isCurrent
                          ? 'border-indigo-500 bg-indigo-50/50 text-indigo-950 shadow-sm'
                          : isDone
                          ? 'border-emerald-200 bg-emerald-50/20 text-emerald-900'
                          : 'border-slate-100 bg-slate-50/30 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wide">
                          {idx + 1}. {step.name}
                        </span>
                        {isDone && (
                          <CheckCircle
                            size={14}
                            className={isCurrent ? 'text-indigo-600' : 'text-emerald-600'}
                          />
                        )}
                      </div>
                      <p className="text-[10px] mt-1 opacity-80 leading-normal">
                        {step.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Grid details and Image */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Details */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Issue Specifications</h3>
                  
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/50 space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="text-rose-500 mt-1 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Location</span>
                        <span className="text-sm font-bold text-slate-800">{activeReport.location}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar size={16} className="text-slate-500 mt-1 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Reported Date</span>
                        <span className="text-sm font-bold text-slate-800">{formatDate(activeReport.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock size={16} className="text-slate-500 mt-1 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Last Activity</span>
                        <span className="text-sm font-bold text-slate-800">{formatDate(activeReport.updatedAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <User size={16} className="text-slate-500 mt-1 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Reported By</span>
                        <span className="text-sm font-bold text-slate-800">{activeReport.reportedBy}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Report Details</h3>
                  <div className="bg-white border border-slate-200 rounded-xl p-4 text-sm text-slate-700 leading-relaxed font-medium">
                    {activeReport.description}
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Image Proof */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Visual proof</h3>
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 aspect-video max-h-72 shadow-inner">
                  {activeReport.imageUrl ? (
                    <img
                      src={activeReport.imageUrl}
                      alt={activeReport.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 space-y-1">
                      <Eye size={36} className="opacity-40" />
                      <span className="text-xs font-semibold">No visual proof provided</span>
                    </div>
                  )}
                </div>

                {/* Admin Status update controller */}
                {currentUser?.role === 'admin' && (
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 space-y-3">
                    <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldAlert size={14} /> Admin Status Controller
                    </h4>
                    <p className="text-xs text-indigo-700">As a city authority, you can override and dispatch work crews:</p>
                    
                    <div className="flex gap-2">
                      <select
                        value={adminStatusInput}
                        onChange={(e) => setAdminStatusInput(e.target.value as IssueStatus)}
                        className="bg-white border border-indigo-200 text-slate-800 px-3 py-2 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1 cursor-pointer"
                      >
                        <option value="Submitted">Submitted</option>
                        <option value="Under Review">Under Review</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                      <button
                        onClick={handleAdminStatusSubmit}
                        className="bg-indigo-700 hover:bg-indigo-850 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm cursor-pointer"
                      >
                        Update
                      </button>
                    </div>

                    {statusMessage && (
                      <p className="text-[11px] font-bold text-emerald-700 animate-pulse">{statusMessage}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        /* RECENT ISSUES PRESETS TABLE LIKE SCREENSHOT 5 */
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Issues</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reports.slice(0, 4).map((report) => (
              <div
                key={report.id}
                onClick={() => handleQuickClick(report.id)}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow hover:border-slate-300 transition cursor-pointer flex justify-between items-center"
              >
                <div className="space-y-1 pr-3">
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                    <span>{report.id}</span>
                    <span>•</span>
                    <span>{report.category}</span>
                  </div>
                  <h3 className="font-extrabold text-slate-800 text-sm leading-snug line-clamp-1">
                    {report.title}
                  </h3>
                </div>

                <span className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyle(report.status)}`}>
                  <span className="w-1 h-1 rounded-full bg-current"></span>
                  {report.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
