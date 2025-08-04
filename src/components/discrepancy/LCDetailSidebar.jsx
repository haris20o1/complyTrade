// import React from 'react';
// import { Activity } from 'lucide-react';

// const Sidebar = ({
//   mainPoints,
//   currentView,
//   activeTab,
//   visitedTabs,
//   priceVerificationData,
//   isStatusCheckboxEnabled,
//   missingDocumentStatus,
//   remainingCount,
//   onViewChange,
//   onTabChange,
//   navigate
// }) => {
//   return (
//     <div className="w-64 fixed h-screen bg-gray-300 border-r border-gray-200 min-h-screen">
//       {/* Status Box */}
//       <div className="p-4 border-b border-gray-200 bg-gradient-to-r bg-indigo-900 bg-indigo-900]">
//         {!isStatusCheckboxEnabled() && (
//           <div className="text-xs text-white/90 bg-indigo-900 p-2 rounded-md">
//             {missingDocumentStatus
//               ? "Missing supporting documents"
//               : `${remainingCount} issues need resolution`}
//           </div>
//         )}
//       </div>

//       {/* Document Navigation */}
//       <div className="p-4 border-b border-gray-200">
//         <h2 className="text-sm font-bold text-gray-900 mb-3">Navigation</h2>
//         <div className="space-y-1">
//           {/* LC Discrepancies Tab */}
//           <button
//             className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-between ${
//               currentView === 'discrepancies'
//                 ? 'bg-indigo-900 text-white'
//                 : 'text-gray-700 hover:bg-indigo-100 hover:text-indigo-900'
//             }`}
//             onClick={() => onViewChange('discrepancies')}
//           >
//             <span>LC Discrepancies</span>
//             <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
//               currentView === 'discrepancies' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
//             }`}>
//               {mainPoints.length}
//             </span>
//           </button>

//           {/* Price Verification Tab */}
//           <button
//             className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-between ${
//               currentView === 'price-verification'
//                 ? 'bg-indigo-900 text-white'
//                 : 'text-gray-700 hover:bg-indigo-100 hover:text-indigo-900'
//             }`}
//             onClick={() => onViewChange('price-verification')}
//           >
//             <span>Price Verification</span>
//             <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
//               currentView === 'price-verification' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
//             }`}>
//               {priceVerificationData.length}
//             </span>
//           </button>

//           {/* Vessel Tracking Tab */}
//           <button
//             className="w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center text-gray-700 hover:bg-indigo-100 hover:text-indigo-900"
//             onClick={() => navigate('/vesseltracking')}
//           >
//             <Activity className="h-4 w-4 mr-2" />
//             <span>Vessel Tracking</span>
//           </button>

//           {/* Document Tabs - Only show when in discrepancies view */}
//           {currentView === 'discrepancies' && (
//             <div className="mt-4 pt-3 border-t border-gray-300">
//               <h3 className="text-xs font-bold text-gray-600 mb-2 uppercase">Documents</h3>
//               {mainPoints.map((point, index) => (
//                 <button
//                   key={point.doc_uuid}
//                   className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-between ${
//                     activeTab === index
//                       ? 'bg-indigo-700 text-white'
//                       : visitedTabs[index]
//                         ? 'text-gray-700 bg-green-100 hover:bg-indigo-50 hover:text-indigo-700'
//                         : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
//                   }`}
//                   onClick={() => onTabChange(index)}
//                 >
//                   <span className="truncate">{point.text}</span>
//                   <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
//                     activeTab === index ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
//                   }`}>
//                     {point.subPoints.length}
//                   </span>
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Legend */}
//       <div className="p-4">
//         <h3 className="text-sm font-bold text-gray-900 mb-3">Legend</h3>
//         <div className="space-y-3">
//           <div className="flex items-center p-2 bg-green-50 rounded-2xl">
//             <span className="flex items-center justify-center h-6 w-12 rounded-full bg-green-500 text-white mr-2 text-[11px] font-bold">
//               C
//             </span>
//             <span className="text-xs text-green-700">No discrepancy</span>
//           </div>

//           <div className="flex items-center p-2 bg-red-50 rounded-2xl">
//             <span className="flex items-center justify-center h-6 w-12 rounded-full bg-red-500 text-white mr-2 text-[10px] font-bold">
//               D
//             </span>
//             <span className="text-xs text-red-700">Discrepancy confirmed</span>
//           </div>

//           <div className="flex items-center p-2 bg-yellow-50 rounded-2xl">
//             <span className="flex items-center justify-center h-6 w-12 rounded-full bg-yellow-500 text-white mr-2 text-[11px] font-bold">
//               RA
//             </span>
//             <span className="text-xs text-yellow-700">Reassignment needed</span>
//           </div>
//         </div>
//       </div>

//       {/* Progress Indicator */}
//       <div className="p-4 mt-4">
//         <h3 className="text-sm font-bold text-gray-900 mb-3">Review Progress</h3>
//         <div className="bg-gray-200 rounded-full h-2.5 mb-1">
//           <div
//             className="bg-blue-600 h-2.5 rounded-full"
//             style={{ width: `${(Object.values(visitedTabs).filter(v => v).length / mainPoints.length) * 100}%` }}
//           ></div>
//         </div>
//         <p className="text-xs text-gray-500 text-right">
//           {Object.values(visitedTabs).filter(v => v).length} of {mainPoints.length} reviewed
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
import React from 'react';
import { Activity, ChevronDown, ChevronRight, FileText, DollarSign, PenTool, Ship } from 'lucide-react';

const Sidebar = ({
  mainPoints,
  currentView,
  activeTab,
  visitedTabs,
  priceVerificationData,
  signatureData = [],
  isStatusCheckboxEnabled,
  missingDocumentStatus,
  remainingCount,
  onViewChange,
  onTabChange,
  navigate
}) => {
  return (
    <div className="w-64 fixed h-screen bg-gray-300 border-r border-gray-200 min-h-screen">
      {/* Status Box */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r bg-indigo-900">
        {!isStatusCheckboxEnabled() && (
          <div className="text-xs text-white/90 bg-indigo-900 p-2 rounded-md">
            {missingDocumentStatus
              ? "Missing supporting documents"
              : `${remainingCount} issues need resolution`}
          </div>
        )}
      </div>

      {/* Document Navigation */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-sm font-bold text-gray-900 mb-3">Navigation</h2>
          
          <div className="space-y-3">
            {/* LC Discrepancies Tab */}
            <div>
              <button
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-between ${
                  currentView === 'discrepancies'
                    ? 'bg-indigo-900 text-white'
                    : 'text-gray-700 hover:bg-indigo-100 hover:text-indigo-900'
                }`}
                onClick={() => onViewChange('discrepancies')}
              >
                <div className="flex items-center">
                  {currentView === 'discrepancies' ? (
                    <ChevronDown className="h-4 w-4 mr-2" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-2" />
                  )}
                  <span>LC Discrepancies</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  currentView === 'discrepancies' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                }`}>
                  {mainPoints.length}
                </span>
              </button>

              {/* Document Dropdown - Only show when in discrepancies view */}
              {currentView === 'discrepancies' && (
                <div className="mt-2 ml-6 space-y-1">
                  {mainPoints.map((point, index) => (
                    <button
                      key={point.doc_uuid}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-between ${
                        activeTab === index
                          ? 'bg-indigo-700 text-white'
                          : visitedTabs[index]
                            ? 'text-gray-700 bg-green-100 hover:bg-indigo-50 hover:text-indigo-700'
                            : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
                      }`}
                      onClick={() => onTabChange(index)}
                    >
                      <span className="truncate text-xs">{point.text}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        activeTab === index ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {point.subPoints.length}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-400"></div>

            {/* Price Verification Tab */}
            <button
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-between ${
                currentView === 'price-verification'
                  ? 'bg-indigo-900 text-white'
                  : 'text-gray-700 hover:bg-indigo-100 hover:text-indigo-900'
              }`}
              onClick={() => onViewChange('price-verification')}
            >
              <span>Price Verification</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                currentView === 'price-verification' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                {priceVerificationData.length}
              </span>
            </button>

            {/* Divider */}
            <div className="border-t border-gray-400"></div>

            {/* Signature Verification Tab */}
            {/* <button
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-between ${
                currentView === 'signature-verification'
                  ? 'bg-indigo-900 text-white'
                  : 'text-gray-700 hover:bg-indigo-100 hover:text-indigo-900'
              }`}
              onClick={() => onViewChange('signature-verification')}
            >
              <span>Signature Verification</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                currentView === 'signature-verification' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                {signatureData.length}
              </span>
            </button> */}

            {/* Divider */}
            {/* <div className="border-t border-gray-400"></div> */}

            {/* Vessel Tracking Tab */}
            <button
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center text-gray-700 hover:bg-indigo-100 hover:text-indigo-900"
              onClick={() => navigate('/vesseltracking')}
            >
              <Activity className="h-4 w-4 mr-2" />
              <span>Vessel Tracking</span>
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Legend</h3>
          <div className="space-y-3">
            <div className="flex items-center p-2 bg-green-50 rounded-2xl">
              <span className="flex items-center justify-center h-6 w-12 rounded-full bg-green-500 text-white mr-2 text-[11px] font-bold">
                C
              </span>
              <span className="text-xs text-green-700">No discrepancy</span>
            </div>

            <div className="flex items-center p-2 bg-red-50 rounded-2xl">
              <span className="flex items-center justify-center h-6 w-12 rounded-full bg-red-500 text-white mr-2 text-[10px] font-bold">
                D
              </span>
              <span className="text-xs text-red-700">Discrepancy confirmed</span>
            </div>

            <div className="flex items-center p-2 bg-yellow-50 rounded-2xl">
              <span className="flex items-center justify-center h-6 w-12 rounded-full bg-yellow-500 text-white mr-2 text-[11px] font-bold">
                RA
              </span>
              <span className="text-xs text-yellow-700">Review</span>
            </div>
          </div>
        </div>
  

      {/* Progress Indicator */}
      <div className="p-4 mt-4">
        <h3 className="text-sm font-bold text-gray-900 mb-3">Review Progress</h3>
        <div className="bg-gray-200 rounded-full h-2.5 mb-1">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${(Object.values(visitedTabs).filter(v => v).length / mainPoints.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 text-right">
          {Object.values(visitedTabs).filter(v => v).length} of {mainPoints.length} reviewed
        </p>
      </div>
    </div>
  );
};

export default Sidebar;