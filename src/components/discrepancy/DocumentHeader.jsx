import React from 'react';

const DocumentHeader = ({ mainPoint }) => {
  return (
    <div className="mb-6 bg-white rounded-2xl shadow-lg overflow-hidden border-l-4 border-[#343de7]">
      <div className="p-5 bg-gradient-to-r from-white to-[#3d43a8] border border-gray-300 shadow-2xl rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{mainPoint.text}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {mainPoint.subPoints.length} {mainPoint.subPoints.length === 1 ? 'issue' : 'issues'} identified
            </p>
          </div>

          {/* Status Summary */}
          <div className="flex space-x-2">
            <div className="text-center px-3 py-1 bg-green-100 rounded-md">
              <span className="text-xs text-green-800 font-medium">Clean (C)</span>
              <p className="text-lg font-bold text-green-600">
                {mainPoint.subPoints.filter(sp => sp.status === 'clean').length}
              </p>
            </div>
            <div className="text-center px-3 py-1 bg-red-100 rounded-md">
              <span className="text-xs text-red-800 font-medium">Discrepant (D)</span>
              <p className="text-lg font-bold text-red-600">
                {mainPoint.subPoints.filter(sp => sp.status === 'discripant').length}
              </p>
            </div>
            <div className="text-center px-3 py-1 bg-yellow-100 rounded-md">
              <span className="text-xs text-yellow-800 font-medium">Review (RA)</span>
              <p className="text-lg font-bold text-yellow-600">
                {mainPoint.subPoints.filter(sp => sp.status === 'review').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentHeader;