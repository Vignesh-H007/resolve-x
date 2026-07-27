import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Search, ExternalLink, CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { IssueStatus } from '../types';

export const AdminPortal: React.FC<{ onNavigateToTrack: (id: string) => void }> = ({ onNavigateToTrack }) => {
  const { reports, updateReportStatus } = useApp();

  const [activeTab, setActiveTab] = useState<IssueStatus | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<Record<string, IssueStatus>>({});
  const [feedbackMsg, setFeedbackMsg] = useState('');

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

  // Date Formatting (DD/MM/YYYY)
  const formatDateSlash = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

  // Status lists counts
  const countAll = reports.length;
  const countSubmitted = reports.filter(r => r.status === 'Submitted').length;
  const countUnderReview = reports.filter(r => r.status === 'Under Review').length;
  const countInProgress = reports.filter(r => r.status === 'In Progress').length;
  const countResolved = reports.filter(r => r.status === 'Resolved').length;

  const handleStatusChangeLocal = (reportId: string, status: IssueStatus) => {
    setSelectedStatuses(prev => ({
      ...prev,
      [reportId]: status
    }));
  };

  const handleCommitStatusUpdate = (reportId: string) => {
    const nextStatus = selectedStatuses[reportId];
    if (!nextStatus) return;

    updateReportStatus(reportId, nextStatus);
    setFeedbackMsg(`Successfully updated report ${reportId} to ${nextStatus}.`);
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  // Filter & Search Logic
  const filteredReports = reports.filter(report => {
    const matchesTab = activeTab === 'All' || report.status === activeTab;
    const matchesSearch = 
      report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Shield className="text-blue-900" size={28} />
          Admin Portal
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage and update the status of all reported issues.
        </p>
      </div>

      {feedbackMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 animate-pulse">
          <CheckCircle size={16} className="text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Filter Tabs & Search Bar Container */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Status Tab selectors */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'All' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({countAll})
          </button>
          <button
            onClick={() => setActiveTab('Submitted')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'Submitted' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Submitted ({countSubmitted})
          </button>
          <button
            onClick={() => setActiveTab('Under Review')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'Under Review' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Under Review ({countUnderReview})
          </button>
          <button
            onClick={() => setActiveTab('In Progress')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'In Progress' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            In Progress ({countInProgress})
          </button>
          <button
            onClick={() => setActiveTab('Resolved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'Resolved' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Resolved ({countResolved})
          </button>
        </div>

        {/* Search Input Box */}
        <div className="relative rounded-xl shadow-sm max-w-sm w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search size={16} className="text-slate-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search ID, title, location..."
            className="block w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl bg-white text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Desktop Reports Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-4">ID</th>
                <th className="px-5 py-4">Title</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Location</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-center">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400 font-medium text-sm">
                    No reports match the current filters.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => {
                  const currentDropdownVal = selectedStatuses[report.id] || report.status;
                  const isModified = currentDropdownVal !== report.status;
                  const isResolved = report.status === 'Resolved';

                  return (
                    <tr key={report.id} className="hover:bg-slate-50/30 transition-colors">
                      {/* ID */}
                      <td className="px-5 py-4 font-bold text-slate-500 font-mono">
                        <button
                          onClick={() => onNavigateToTrack(report.id)}
                          className="hover:text-blue-700 hover:underline flex items-center gap-0.5 cursor-pointer text-left"
                          title="View Details"
                        >
                          {report.id}
                          <ExternalLink size={11} className="opacity-60" />
                        </button>
                      </td>

                      {/* Title */}
                      <td className="px-5 py-4 font-bold text-slate-900 max-w-xs truncate">
                        {report.title}
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4 text-slate-500 font-bold">
                        {report.category}
                      </td>

                      {/* Location */}
                      <td className="px-5 py-4 text-slate-600 font-semibold max-w-[150px] truncate">
                        {report.location}
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-slate-400">
                        {formatDateSlash(report.createdAt)}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyle(report.status)}`}>
                          <span className="w-1 h-1 rounded-full bg-current"></span>
                          {report.status}
                        </span>
                      </td>

                      {/* Update controls */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <select
                            value={currentDropdownVal}
                            onChange={(e) => handleStatusChangeLocal(report.id, e.target.value as IssueStatus)}
                            className="bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded-md text-[10px] font-bold focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                          >
                            <option value="Submitted">Submitted</option>
                            <option value="Under Review">Under Review</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>

                          <button
                            onClick={() => handleCommitStatusUpdate(report.id)}
                            disabled={!isModified}
                            className={`px-3 py-1 rounded-md text-[10px] font-bold transition shadow-xs cursor-pointer ${
                              isModified
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            {currentDropdownVal === 'Resolved' && report.status !== 'Resolved' ? 'Resolve' : 'Update'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
