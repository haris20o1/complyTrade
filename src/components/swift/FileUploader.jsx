// import React, { useRef } from 'react';
// import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

// const FileUploader = ({ onFilesSelected, disabled }) => {
//   const fileInputRef = useRef(null);

//   const handleFileChange = (e) => {
//     if (onFilesSelected) {
//       onFilesSelected(Array.from(e.target.files));
//     }
//     // Reset the input value to allow selecting files again
//     e.target.value = '';
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     if (onFilesSelected && !disabled) {
//       onFilesSelected(Array.from(e.dataTransfer.files));
//     }
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   return (
//     <div 
//       className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md ${
//         disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'
//       }`}
//       onDragOver={handleDragOver}
//       onDrop={handleDrop}
//       onClick={() => !disabled && fileInputRef.current.click()}
//     >
//       <div className="space-y-1 text-center">
//         <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
//         <div className="flex text-sm text-gray-600">
//           <label className={`relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 ${
//             !disabled && 'hover:text-indigo-500'
//           } focus-within:outline-none`}>
//             <span>Upload PDF files</span>
//             <input
//               ref={fileInputRef}
//               type="file"
//               multiple
//               className="sr-only"
//               onChange={handleFileChange}
//               disabled={disabled}
//               accept=".pdf, .txt, image/*"
//             />
//           </label>
//           <p className="pl-1">or drag and drop</p>
//         </div>
//         <p className="text-xs text-gray-500">
//           Only PDF files are allowed.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default FileUploader;


import React, { useRef } from 'react';
import { Upload, FileText, X } from 'lucide-react';

const FileUploader = ({ onFilesSelected, disabled }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (onFilesSelected) {
      onFilesSelected(Array.from(e.target.files));
    }
    e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (onFilesSelected && !disabled) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div 
  className={`border-2 border-dashed border-gray-600 rounded-lg p-4 text-center transition-all duration-200 ${
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-cyan-400 hover:bg-gray-700/30'
  }`}
  onDragOver={handleDragOver}
  onDrop={handleDrop}
  onClick={() => !disabled && fileInputRef.current.click()}
>
  <div className="flex flex-col items-center space-y-3">
    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
      <Upload className="h-5 w-5 text-white" />
    </div>
    <div>
      <p className="text-white text-base font-medium mb-1">
        Drop files here or click to browse
      </p>
      <p className="text-gray-400 text-xs">
        PDF, DOC, DOCX, JPG, PNG • Max 10MB per file
      </p>
    </div>
    <input
      ref={fileInputRef}
      type="file"
      multiple
      className="hidden"
      onChange={handleFileChange}
      disabled={disabled}
      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
    />
  </div>
</div>
  );
};
export default FileUploader;