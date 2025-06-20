import React from 'react';

const IssuesTable = ({
  mainPoint,
  mainIndex,
  newSubPoint,
  selectedSubPoint,
  onRemarksChange,
  onSelection,
  onAddSubPoint,
  onDeleteSubPoint,
  onNewSubPointChange,
  onSubPointSelect
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
      <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-800">Issues & Discrepancies</h3>

        {selectedSubPoint && selectedSubPoint.mainIndex === mainIndex && (
          <button
            onClick={onDeleteSubPoint}
            className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Selected
          </button>
        )}
      </div>

      {/* Issues Table */}
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-900">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-2/5">
                Issue Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-2/5">
                Remarks
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  C
                </span>
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  D
                </span>
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  RA
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mainPoint.subPoints.length > 0 ? (
              mainPoint.subPoints.map((subPoint) => (
                <tr
                  key={subPoint.id}
                  className={`hover:bg-[#646cffaa]/5 cursor-pointer transition-colors ${
                    selectedSubPoint?.mainIndex === mainIndex &&
                    selectedSubPoint?.subPointId === subPoint.id
                      ? "bg-[#646cffaa]/10"
                      : ""
                  }`}
                  onClick={() => onSubPointSelect({
                    mainIndex,
                    subPointId: subPoint.id
                  })}
                >
                  <td className="px-6 py-4 text-md text-gray-900">
                    {subPoint.text}
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={subPoint.remarks || ''}
                        onChange={(e) => onRemarksChange(mainIndex, subPoint.id, e.target.value)}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-white"
                        placeholder="Add remarks..."
                        onClick={(e) => e.stopPropagation()}
                      />
                      {subPoint.remarks && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemarksChange(mainIndex, subPoint.id, '');
                          }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                          aria-label="Clear remarks"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center">
                      <input
                        type="radio"
                        name={`point-${mainIndex}-${subPoint.id}`}
                        value="NO"
                        checked={subPoint.status === 'clean'}
                        onChange={() => onSelection(mainIndex, subPoint.id, 'NO')}
                        className="h-5 w-5 text-green-600 border-gray-300 focus:ring-green-500"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center">
                      <input
                        type="radio"
                        name={`point-${mainIndex}-${subPoint.id}`}
                        value="YES"
                        checked={subPoint.status === 'discripant'}
                        onChange={() => onSelection(mainIndex, subPoint.id, 'YES')}
                        className="h-5 w-5 text-red-600 border-gray-300 focus:ring-red-500"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center">
                      <input
                        type="radio"
                        name={`point-${mainIndex}-${subPoint.id}`}
                        value="RA"
                        checked={subPoint.status === 'review'}
                        onChange={() => onSelection(mainIndex, subPoint.id, 'RA')}
                        className="h-5 w-5 text-yellow-600 border-gray-300 focus:ring-yellow-500"
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center">
                  <div className="flex flex-col items-center">
                    <div className="h-16 w-16 text-gray-400 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-lg">No issues found for this document</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add New Issue */}
      <div className="p-5 border-t border-gray-200 bg-gray-50">
        <div className="flex rounded-md shadow-sm">
          <input
            type="text"
            value={newSubPoint}
            onChange={(e) => onNewSubPointChange(e.target.value)}
            placeholder="Add a new issue..."
            className="flex-1 min-w-0 block w-full px-4 py-3 rounded-l-md border border-gray-300 focus:outline-none focus:ring-[#646cffaa] focus:border-[#646cffaa] sm:text-sm"
          />
          <button
            onClick={() => onAddSubPoint(mainIndex)}
            className="inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-900 hover:bg-[#646cffaa]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#646cffaa] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Issue
          </button>
        </div>
      </div>
    </div>
  );
};

export default IssuesTable;
