import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Plus, 
  Video, 
  FileText, 
  Sparkles, 
  UploadCloud, 
  Link as LinkIcon, 
  Clock, 
  BookOpen, 
  X 
} from 'lucide-react';
import { R2FileUploader } from '../common/R2FileUploader';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/soundEffects';

export const AddLessonModal = ({ isOpen, onClose }) => {
  const { currentTeacher, addLesson, showToast } = useApp();

  const [formData, setFormData] = useState({
    title: '',
    unit: 'Unit 01',
    duration: '2h 15m',
    batchId: currentTeacher?.batches?.[0]?.id || '',
    description: '',
    videoType: 'link', // 'link' | 'upload'
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
    notesPdf: 'Lesson_Theory_Notes.pdf',
    notesPdfUrl: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title) {
      showToast('Please enter a lesson title.', 'error');
      return;
    }

    if (!formData.videoUrl) {
      showToast('Please provide a video URL or upload a video.', 'error');
      return;
    }

    addLesson({
      title: formData.title,
      unit: formData.unit,
      duration: formData.duration,
      batchId: formData.batchId,
      videoUrl: formData.videoUrl,
      thumbnail: formData.thumbnail,
      notesPdf: formData.notesPdf,
      notesPdfUrl: formData.notesPdfUrl,
      description: formData.description || 'Theory explanation, sample questions, and past paper analysis.',
      chapters: [
        { time: 0, title: '01. Theory Overview & Axioms' },
        { time: 900, title: '02. Derivations & Formulas' },
        { time: 2400, title: '03. Past Paper Essay Problems' },
      ],
    });

    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}

    showToast(`Lecture "${formData.title}" published with Cloudflare R2 assets!`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 my-auto max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-sm">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">Upload Video Lecture & Tute Notes</h3>
              <p className="text-xs text-slate-500">Publish HD lectures & PDF materials to Cloudflare R2 CDN</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Target Batch Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target Batch:</label>
            <select
              value={formData.batchId}
              onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-blue-500"
            >
              {currentTeacher?.batches?.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.code} — {b.title}
                </option>
              ))}
            </select>
          </div>

          {/* Lesson Title & Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Lecture Title:</label>
              <input
                type="text"
                required
                placeholder="e.g. Lesson 14: Integral Calculus — Trigonometric Substitution"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Unit / Duration:</label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Unit 05"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-24 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2.5 text-xs text-slate-900 font-bold focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="2h 30m"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2.5 text-xs text-slate-900 font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Video Delivery Selector */}
          <div className="space-y-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Video className="w-4 h-4 text-blue-600" />
                Video Source:
              </span>
              <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, videoType: 'link' })}
                  className={`px-3 py-1 rounded-lg font-bold transition ${
                    formData.videoType === 'link' ? 'bg-blue-600 text-white' : 'text-slate-600'
                  }`}
                >
                  Stream / Video URL
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, videoType: 'upload' })}
                  className={`px-3 py-1 rounded-lg font-bold transition ${
                    formData.videoType === 'upload' ? 'bg-blue-600 text-white' : 'text-slate-600'
                  }`}
                >
                  Upload MP4 to R2
                </button>
              </div>
            </div>

            {formData.videoType === 'link' ? (
              <input
                type="text"
                placeholder="Paste MP4 URL, Bunny Stream HLS, or YouTube/Vimeo embed URL"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-500"
              />
            ) : (
              <R2FileUploader
                folder="videos"
                accept="video/mp4,video/webm,video/*"
                label=""
                helperText="Upload lecture MP4 directly to Cloudflare R2 bucket"
                maxSizeMB={500}
                onUploadSuccess={(res) => {
                  if (res.url) {
                    setFormData((prev) => ({ ...prev, videoUrl: res.url }));
                  }
                }}
              />
            )}
          </div>

          {/* R2 PDF Tute / Notes Uploader */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <R2FileUploader
              folder="notes"
              accept=".pdf,.doc,.docx,application/pdf"
              label="Lecture Notes & Tute PDF (Cloudflare R2)"
              helperText="Upload course tute or theory notes. Students can download from R2 CDN."
              maxSizeMB={100}
              onUploadSuccess={(res) => {
                if (res.url) {
                  setFormData((prev) => ({
                    ...prev,
                    notesPdf: res.name || 'Lesson_Tute_Notes.pdf',
                    notesPdfUrl: res.url,
                  }));
                }
              }}
            />
          </div>

          {/* R2 Thumbnail Cover Uploader */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <R2FileUploader
              folder="thumbnails"
              accept="image/*"
              label="Lesson Thumbnail Cover (Optional)"
              helperText="Upload custom lecture cover image"
              isImage={true}
              currentUrl={formData.thumbnail}
              onUploadSuccess={(res) => {
                if (res.url) {
                  setFormData((prev) => ({ ...prev, thumbnail: res.url }));
                }
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Publish Lecture to Students</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
