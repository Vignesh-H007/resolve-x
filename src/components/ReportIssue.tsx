import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ClipboardList, Image, Upload, AlertCircle, CheckCircle, MapPin, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { IssueCategory } from '../types';

interface ReportIssueProps {
  onSuccess: (newId: string) => void;
}

const CATEGORIES: IssueCategory[] = [
  'Roads',
  'Water Supply',
  'Waste Management',
  'Street Lighting',
  'Public Safety'
];

// Aesthetic Unsplash presets for demonstration in case they don't have a file on hand
const PRESET_IMAGES = [
  { label: 'Pothole', url: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80' },
  { label: 'Garbage', url: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80' },
  { label: 'Water Leak', url: 'https://images.unsplash.com/photo-1508873696983-2df519f0397e?auto=format&fit=crop&w=600&q=80' },
  { label: 'Dark Lamp', url: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=600&q=80' }
];

export const ReportIssue: React.FC<ReportIssueProps> = ({ onSuccess }) => {
  const { addReport } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<IssueCategory>('Roads');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG/JPG).');
      return;
    }
    if (file.size > 2.5 * 1024 * 1024) {
      setError('File is too large. Max allowed size is 2.5 MB.');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Issue title is required.');
      return;
    }
    if (!location.trim()) {
      setError('Location is required.');
      return;
    }
    if (!description.trim()) {
      setError('Description is required.');
      return;
    }

    setIsSubmitting(true);
    
    // Slight simulation for beautiful UI feedback
    setTimeout(() => {
      const finalImg = imageUrl || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80';
      const newReport = addReport({
        title: title.trim(),
        category,
        location: location.trim(),
        description: description.trim(),
        imageUrl: finalImg
      });
      setIsSubmitting(false);
      onSuccess(newReport.id);
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <ClipboardList className="text-blue-900" size={28} />
          Report an issue
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Provide as much detail as possible to help us resolve it faster.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6 sm:p-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Issue Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Issue title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Large pothole on Main Street"
              className="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
            />
          </div>

          {/* Category & Location side-by-side on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as IssueCategory)}
                className="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Location *
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <MapPin size={16} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Street, area, landmark"
                  className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Description *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail..."
              className="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
            ></textarea>
          </div>

          {/* Image Upload Block */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Image (optional)
            </label>

            {/* Drag & Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[140px] ${
                isDragging
                  ? 'border-blue-600 bg-blue-50/50'
                  : imageUrl
                  ? 'border-emerald-300 bg-emerald-50/20'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              {imageUrl ? (
                <div className="space-y-3 w-full max-w-xs mx-auto">
                  <div className="relative rounded-lg overflow-hidden border border-slate-200 max-h-36">
                    <img
                      src={imageUrl}
                      alt="Uploaded civic issue"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-700 font-bold">
                    <CheckCircle size={14} /> Image Loaded successfully
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageUrl('');
                    }}
                    className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="mx-auto w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <Upload size={18} />
                  </div>
                  <p className="text-sm font-semibold text-slate-800">
                    Click to upload an image
                  </p>
                  <p className="text-xs text-slate-400 font-medium">
                    PNG or JPG, up to 2.5 MB
                  </p>
                </div>
              )}
            </div>

            {/* Demo Image presets widget */}
            {!imageUrl && (
              <div className="mt-3 bg-slate-50 p-3 rounded-xl border border-slate-200/40">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Sparkles size={11} className="text-indigo-500" />
                  Quick test: Pick a preset demo photo
                </p>
                <div className="flex flex-wrap gap-2">
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImageUrl(preset.url)}
                      className="text-xs bg-white border border-slate-200 hover:border-blue-500 px-2.5 py-1.5 rounded-lg font-medium text-slate-600 flex items-center gap-1 shadow-sm transition hover:bg-blue-50/10 cursor-pointer"
                    >
                      <Image size={11} className="text-blue-500" />
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-blue-900 hover:bg-blue-850 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition disabled:opacity-75 cursor-pointer"
            >
              {isSubmitting ? 'Submitting report...' : 'Submit report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
