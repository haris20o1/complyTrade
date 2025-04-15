// components/swift/FileUploader.jsx
import React, { useRef } from 'react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

const FileUploader = ({ onFilesSelected, disabled }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (onFilesSelected) {
      onFilesSelected(Array.from(e.target.files));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (onFilesSelected && !disabled) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div 
      className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => !disabled && fileInputRef.current.click()}
    >
      <div className="space-y-1 text-center">
        <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
        <div className="flex text-sm text-gray-600">
          <label className={`relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 ${!disabled && 'hover:text-indigo-500'} focus-within:outline-none`}>
            <span>Upload PDF files</span>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="sr-only"
              onChange={handleFileChange}
              disabled={disabled}
              accept=".pdf"
            />
          </label>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs text-gray-500">Only PDF files are allowed.</p>
      </div>
    </div>
  );
};

export default FileUploader;
