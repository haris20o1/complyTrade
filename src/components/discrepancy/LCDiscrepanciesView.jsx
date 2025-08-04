import React, { useState } from 'react';
import DocumentHeader from './DocumentHeader';
import IssuesTable from './IssuesTable';

const LCDiscrepanciesView = ({
  mainPoints,
  activeTab,
  newSubPoint,
  selectedSubPoint,
  onRemarksChange,
  onSelection,
  onAddSubPoint,
  onDeleteSubPoint,
  onNewSubPointChange,
  onSubPointSelect,
  onSaveDraft,
  onDocumentClick,
  onSignatureValidityUpdate
}) => {
  const [isSignatureDropdownOpen, setSignatureDropdownOpen] = useState(false);

  const handleSignatureValidityToggle = (mainIndex, signatureId, isValid) => {
    if (onSignatureValidityUpdate) {
      onSignatureValidityUpdate(mainIndex, signatureId, isValid);
    }
  };

  return (
    <>
      {mainPoints.map((mainPoint, mainIndex) => (
        <div
          key={mainPoint.doc_uuid}
          className={`${activeTab === mainIndex ? 'block' : 'hidden'}`}
        >
         <DocumentHeader 
  mainPoint={mainPoints[activeTab]} 
  onDocumentClick={onDocumentClick} // Add this prop
/>

          {/* Signature Verification Section */}
          {mainPoint.signatures && mainPoint.signatures.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div
                className="p-3 border-b-2 border-gray-300 bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => setSignatureDropdownOpen(!isSignatureDropdownOpen)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      Signature Verification
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      Review and verify signatures on this document ({mainPoint.signatures.length} items)
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* Summary indicators */}
                    <div className="flex items-center space-x-3 text-xs mr-3">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                        <span>{mainPoint.signatures.filter(s => s.status === 'valid').length}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                        <span>{mainPoint.signatures.filter(s => s.status !== 'valid').length}</span>
                      </div>
                    </div>
                    {/* Chevron icon */}
                    <svg
                      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isSignatureDropdownOpen ? 'rotate-180' : ''
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Collapsible content */}
              {isSignatureDropdownOpen && (
                <div className="p-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {mainPoint.signatures.map((signature) => (
                      <div
                        key={signature.id}
                        className={`border rounded-md p-3 transition-all duration-200 ${signature.status === 'valid'
                            ? 'border-green-200 bg-green-50'
                            : 'border-red-200 bg-red-50'
                          }`}
                      >
                        {/* Compact header */}
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 text-xs">#{signature.id}</h4>
                          <div className={`w-2 h-2 rounded-full ${signature.status === 'valid' ? 'bg-green-500' : 'bg-red-500'
                            }`}></div>
                        </div>

                        {/* Signature details with proper labeling */}
                        <div className="space-y-1 mb-3">
                <div>
                  <p className="text-xs font-medium text-gray-900">
                    <span className="text-gray-600">Point:</span> {signature.point || 'No signature found on seal'}
                  </p>
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Value:</span> {signature.value || 'Sign'}
                  </p>
                </div>

                {signature.remarks && (
                  <div>
                    <p className="text-xs text-gray-600" title={signature.remarks}>
                      <span className="font-medium">Remarks:</span> {signature.remarks}
                    </p>
                  </div>
                )}
              </div>

              {/* Toggle switch */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Status:</span>
                <button
                  onClick={() => handleSignatureValidityToggle(mainIndex, signature.id, signature.status === 'Discripant')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    signature.status === 'valid'
                      ? 'bg-green-600 focus:ring-green-500'
                      : 'bg-red-600 focus:ring-red-500'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      signature.status === 'valid' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>                      </div>
                    ))}
                  </div>

                  {/* Detailed summary */}
                  <div className="mt-3 p-2 bg-gray-50 rounded-md">
                    <h4 className="text-xs font-medium text-gray-900 mb-1">Verification Summary</h4>
                    <div className="flex items-center space-x-4 text-xs">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                        <span>Valid: {mainPoint.signatures.filter(s => s.status === 'valid').length}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                        <span>Invalid: {mainPoint.signatures.filter(s => s.status !== 'valid').length}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
                        <span>Total: {mainPoint.signatures.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Issues Table */}
          <IssuesTable
            mainPoint={mainPoint}
            mainIndex={mainIndex}
            newSubPoint={newSubPoint}
            selectedSubPoint={selectedSubPoint}
            onRemarksChange={onRemarksChange}
            onSelection={onSelection}
            onAddSubPoint={onAddSubPoint}
            onDeleteSubPoint={onDeleteSubPoint}
            onNewSubPointChange={onNewSubPointChange}
            onSubPointSelect={onSubPointSelect}
          />

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-8">
            <button
              onClick={onSaveDraft}
              className="inline-flex items-center px-5 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#646cffaa] transition-colors shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Draft
            </button>
          </div>
        </div>
      ))}

      {/* Empty State */}
      {mainPoints.length === 0 && (
        <div className="bg-white rounded-lg shadow-lg p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="h-24 w-24 text-[#646cff] mb-6 bg-[#646cffaa]/10 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No documents found</h3>
            <p className="text-lg text-gray-500 max-w-md mx-auto mb-6">
              There are no documents or discrepancies recorded for this Letter of Credit.
            </p>
            <button className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-md text-white bg-[#646cffaa] hover:bg-[#646cffaa]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#646cffaa] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add First Document
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LCDiscrepanciesView;