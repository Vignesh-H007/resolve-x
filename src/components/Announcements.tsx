import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Volume2, Plus, Edit2, Trash2, Calendar, AlertCircle, CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Announcements: React.FC = () => {
  const { announcements, currentUser, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedAnnId, setSelectedAnnId] = useState<string | null>(null);
  
  const [titleInput, setTitleInput] = useState('');
  const [contentInput, setContentInput] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleOpenCreate = () => {
    setModalMode('create');
    setTitleInput('');
    setContentInput('');
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (id: string, title: string, content: string) => {
    setModalMode('edit');
    setSelectedAnnId(id);
    setTitleInput(title);
    setContentInput(content);
    setError('');
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      deleteAnnouncement(id);
      triggerSuccess('Announcement deleted successfully.');
    }
  };

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!titleInput.trim()) {
      setError('Title cannot be empty.');
      return;
    }
    if (!contentInput.trim()) {
      setError('Content cannot be empty.');
      return;
    }

    if (modalMode === 'create') {
      addAnnouncement(titleInput.trim(), contentInput.trim());
      triggerSuccess('Announcement published successfully!');
    } else if (modalMode === 'edit' && selectedAnnId) {
      updateAnnouncement(selectedAnnId, titleInput.trim(), contentInput.trim());
      triggerSuccess('Announcement updated successfully!');
    }

    setIsModalOpen(false);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Volume2 className="text-blue-900" size={28} />
            Announcements
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Official updates from the municipal corporation.
          </p>
        </div>

        {/* Admin Publish button */}
        {currentUser?.role === 'admin' && (
          <button
            onClick={handleOpenCreate}
            className="bg-blue-900 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-lg hover:bg-blue-850 transition shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus size={16} />
            New
          </button>
        )}
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle size={16} className="text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-sm">
            No official announcements posted at this time.
          </div>
        ) : (
          announcements.map((ann, idx) => (
            <motion.div
              key={ann.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow transition relative group"
            >
              {/* Admin Action Row (Top Right on hover / touch) */}
              {currentUser?.role === 'admin' && (
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(ann.id, ann.title, ann.content)}
                    title="Edit Announcement"
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition cursor-pointer"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(ann.id)}
                    title="Delete Announcement"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}

              <div className="space-y-3 pr-16">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <Calendar size={13} />
                  <span>{formatDate(ann.createdAt)}</span>
                </div>
                
                <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
                  {ann.title}
                </h3>
                
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {ann.content}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200"
            >
              {/* Modal Header */}
              <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
                <h2 className="text-base font-bold">
                  {modalMode === 'create' ? 'Publish Announcement' : 'Edit Announcement'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-xs flex items-start gap-1.5">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Announcement Title
                  </label>
                  <input
                    type="text"
                    required
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    placeholder="e.g. Clean drinking water supply restoration"
                    className="block w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Announcement Content
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={contentInput}
                    onChange={(e) => setContentInput(e.target.value)}
                    placeholder="Provide full description of the announcement..."
                    className="block w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  ></textarea>
                </div>

                <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow transition cursor-pointer"
                  >
                    {modalMode === 'create' ? 'Publish' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
