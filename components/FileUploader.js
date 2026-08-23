import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { uploadPrintFile } from '../services/api';

const MAX_FILE_SIZE_MB = 25;

export default function FileUploader({ onUploadComplete, onUploadReset }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('empty'); // empty, uploading, success, error
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const processFile = async (selectedFile) => {
    if (!selectedFile) return;

    // Validate type: PDF only
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.endsWith('.pdf')) {
      setStatus('error');
      setErrorMsg('Only PDF documents are supported for printing.');
      return;
    }

    // Validate size: 25MB
    const fileSizeMB = selectedFile.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      setStatus('error');
      setErrorMsg(`File exceeds the ${MAX_FILE_SIZE_MB}MB size limit.`);
      return;
    }

    setFile(selectedFile);
    setStatus('uploading');
    setProgress(20);

    try {
      const shopId = sessionStorage.getItem('current_shop_id');
      if (!shopId) {
        throw new Error("Shop connection session is missing. Please scan the QR code again.");
      }

      setProgress(50);
      // Perform actual upload to Supabase Storage (or mock in demo mode)
      const data = await uploadPrintFile(shopId, selectedFile);
      
      setProgress(100);
      setStatus('success');
      
      if (onUploadComplete) {
        onUploadComplete(selectedFile, data);
      }
    } catch (err) {
      console.error("FileUploader upload error:", err);
      setStatus('error');
      setErrorMsg(err.message || 'An error occurred during file upload. Check your internet connection.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const resetUploader = () => {
    setFile(null);
    setProgress(0);
    setStatus('empty');
    setErrorMsg('');
    if (onUploadReset) {
      onUploadReset();
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,application/pdf"
        className="hidden"
      />

      {status === 'empty' && (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={triggerFileSelect}
          className="border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50/20 active:bg-blue-50/40 transition duration-150 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer text-center min-h-[220px]"
        >
          <div className="bg-blue-50 text-blue-600 p-4 rounded-full mb-4">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-gray-800 text-lg mb-1">Upload your document</h3>
          <p className="text-sm text-gray-400 mb-4 max-w-[250px]">Drag & drop your PDF file here, or tap to browse</p>
          <span className="inline-block bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-bold py-2 px-6 rounded-xl shadow-md transition duration-150">
            Choose File
          </span>
          <p className="text-[11px] text-gray-400 font-semibold mt-4">PDF • Max {MAX_FILE_SIZE_MB}MB</p>
        </div>
      )}

      {status === 'uploading' && (
        <div className="border border-gray-200 bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center min-h-[220px]">
          <div className="bg-blue-50 text-blue-600 p-4 rounded-full mb-4 animate-bounce">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-gray-800 text-base mb-1">Uploading document...</h3>
          <p className="text-xs text-gray-400 mb-6 truncate max-w-[250px]">{file?.name}</p>
          
          <div className="w-full max-w-[280px] bg-gray-100 rounded-full h-2.5 overflow-hidden mb-2">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-150"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-xs font-bold text-blue-600">{progress}%</span>
        </div>
      )}

      {status === 'success' && (
        <div className="border border-green-200 bg-green-50/20 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center min-h-[220px]">
          <div className="bg-green-100 text-green-600 p-4 rounded-full mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-green-800 text-lg mb-1">Upload Ready</h3>
          <div className="flex items-center space-x-1.5 bg-white border border-green-200 rounded-lg px-3 py-1.5 mb-6 max-w-[280px] shadow-sm">
            <FileText className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span className="text-xs font-medium text-gray-700 truncate">{file?.name}</span>
          </div>
          <button
            onClick={resetUploader}
            className="flex items-center space-x-1 text-xs font-bold text-gray-400 hover:text-gray-600 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Change File</span>
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="border border-red-200 bg-red-50/20 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center min-h-[220px]">
          <div className="bg-red-100 text-red-600 p-4 rounded-full mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-red-800 text-lg mb-1">Failed to Upload</h3>
          <p className="text-sm text-red-600/80 mb-6 max-w-[260px] leading-snug">{errorMsg}</p>
          <button
            onClick={resetUploader}
            className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-bold py-2.5 px-6 rounded-xl shadow-md transition"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
