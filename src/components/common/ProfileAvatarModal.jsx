import React, { useState } from 'react';
import { Camera, CheckCircle2, X, Sparkles, User } from 'lucide-react';
import { R2FileUploader } from './R2FileUploader';
import confetti from 'canvas-confetti';

export const ProfileAvatarModal = ({ isOpen, onClose, currentAvatar, onSaveAvatar, title = "Update Profile Photo" }) => {
  const [newAvatarUrl, setNewAvatarUrl] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (newAvatarUrl) {
      onSaveAvatar(newAvatarUrl);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[140] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-sm">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">{title}</h3>
              <p className="text-xs text-slate-500">Upload to Cloudflare R2 CDN</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {/* Current vs New Avatar Preview */}
        <div className="flex items-center justify-center gap-4 py-2">
          <div className="text-center space-y-1">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-sm mx-auto">
              <img
                src={newAvatarUrl || currentAvatar}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[10px] font-bold text-slate-500">
              {newAvatarUrl ? "New Preview" : "Current Photo"}
            </span>
          </div>
        </div>

        {/* Cloudflare R2 Image Uploader */}
        <R2FileUploader
          folder="avatars"
          accept="image/*"
          label="Choose New Photo"
          helperText="Upload JPG, PNG, or WebP. Stored on Cloudflare R2."
          isImage={true}
          maxSizeMB={15}
          onUploadSuccess={(res) => {
            if (res.url) {
              setNewAvatarUrl(res.url);
            }
          }}
        />

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
            type="button"
            disabled={!newAvatarUrl}
            onClick={handleSave}
            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Profile Photo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
