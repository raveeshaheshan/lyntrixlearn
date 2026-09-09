import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, FileText, Loader2, X, Image as ImageIcon } from 'lucide-react';
import { uploadToR2 } from '../../lib/r2Storage';

/**
 * Reusable Cloudflare R2 File Uploader Component
 * @param {Object} props
 * @param {string} [props.folder='uploads'] - Target folder in R2 bucket ('slips', 'notes', 'thumbnails', 'videos')
 * @param {string} [props.accept='*'] - Accepted file types (e.g. 'image/*', 'application/pdf', '.pdf,.doc,.docx')
 * @param {string} [props.label='Upload File'] - Label for the uploader
 * @param {string} [props.helperText] - Subtitle instructions
 * @param {string} [props.currentUrl] - Existing URL if already uploaded
 * @param {function} props.onUploadSuccess - Callback with { url, key, name, size, type }
 * @param {function} [props.onFileSelected] - Callback when file is picked (before upload finishes)
 * @param {function} [props.onUploadCancel] - Callback when upload is cancelled
 * @param {boolean} [props.isImage=false] - If true, displays image preview
 * @param {number} [props.maxSizeMB=50] - Maximum file size in megabytes
 */
export const R2FileUploader = ({
  folder = 'uploads',
  accept = 'image/*,application/pdf',
  label = 'Upload File',
  helperText = 'Files are securely stored on Cloudflare R2 CDN',
  currentUrl = '',
  onUploadSuccess,
  onFileSelected,
  onUploadCancel,
  isImage = false,
  maxSizeMB = 50,
}) => {
  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(
    currentUrl ? { url: currentUrl, name: 'Current File' } : null
  );
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFileUpload(file);
    }
  };

  const handleCancelUpload = (e) => {
    e?.stopPropagation?.();
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsUploading(false);
    setUploadProgress(0);
    setErrorMsg('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onUploadCancel) {
      onUploadCancel();
    }
  };

  const processFileUpload = async (file) => {
    setErrorMsg('');

    // Trigger file selected callback (e.g. for duration calculation or name extraction)
    if (onFileSelected) {
      onFileSelected(file);
    }

    // File size validation
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setErrorMsg(`File exceeds maximum allowed size of ${maxSizeMB}MB.`);
      return;
    }

    // Create a new AbortController for this upload
    abortControllerRef.current = new AbortController();

    setIsUploading(true);
    setUploadProgress(15);

    try {
      // Simulate progressive visual feedback
      const progressTimer = setInterval(() => {
        setUploadProgress((prev) => (prev >= 90 ? prev : prev + 15));
      }, 200);

      const result = await uploadToR2({
        file,
        folder,
        abortSignal: abortControllerRef.current.signal,
      });

      clearInterval(progressTimer);

      if (result.cancelled) {
        setIsUploading(false);
        setUploadProgress(0);
        return;
      }

      setUploadProgress(100);

      setUploadedFile({
        url: result.url,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        type: file.type,
      });

      if (onUploadSuccess) {
        onUploadSuccess(result);
      }
    } catch (err) {
      if (err.name === 'AbortError' || abortControllerRef.current?.signal?.aborted) {
        setIsUploading(false);
        setUploadProgress(0);
        return;
      }
      console.error('R2 Upload Failed:', err);
      setErrorMsg(err.message || 'Upload to Cloudflare R2 failed. Please try again.');
    } finally {
      setIsUploading(false);
      abortControllerRef.current = null;
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFileUpload(file);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onUploadSuccess) {
      onUploadSuccess({ url: '', key: '', name: '' });
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-800">{label}</label>
          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Cloudflare R2 CDN
          </span>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Dropzone */}
      {!uploadedFile ? (
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-4 sm:p-5 transition-all text-center cursor-pointer ${
            isDragOver
              ? 'border-blue-500 bg-blue-50/60'
              : 'border-slate-300 hover:border-blue-400 bg-slate-50/70 hover:bg-white'
          }`}
        >
          {isUploading ? (
            <div className="py-3 space-y-3">
              <div className="flex items-center justify-between gap-3 max-w-xs mx-auto">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading to Cloudflare R2 ({uploadProgress}%)...</span>
                </div>
                <button
                  type="button"
                  onClick={handleCancelUpload}
                  className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 rounded-lg text-xs font-bold transition flex items-center gap-1 border border-rose-200 shadow-sm shrink-0"
                  title="Cancel upload"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden max-w-xs mx-auto">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-1.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-100/80 text-blue-600 flex items-center justify-center shadow-sm">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-slate-800">
                Click to browse or drag & drop file
              </div>
              <p className="text-[11px] text-slate-500 max-w-xs">{helperText}</p>
            </div>
          )}
        </div>
      ) : (
        /* Uploaded Success Preview Card */
        <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3 overflow-hidden">
            {isImage && uploadedFile.url ? (
              <img
                src={uploadedFile.url}
                alt="Upload preview"
                className="w-12 h-12 rounded-xl object-cover border border-emerald-300 shadow-sm shrink-0"
              />
            ) : (
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
            )}
            <div className="overflow-hidden space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 truncate">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{uploadedFile.name}</span>
              </div>
              <div className="text-[10px] text-emerald-700 font-medium truncate">
                {uploadedFile.size ? `${uploadedFile.size} • ` : ''}
                <a
                  href={uploadedFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-emerald-900"
                >
                  View on R2 CDN ↗
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 text-[11px] font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium bg-rose-50 p-2 rounded-xl border border-rose-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
