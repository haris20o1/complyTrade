import React, { useState } from 'react';

const SignatureVerificationView = ({ lcNumber }) => {
  // Dummy data for signatures - compact format
  const [signatures, setSignatures] = useState([
    {
      id: 1,
      signatoryName: "John Smith",
      designation: "Export Manager",
      documentType: "Commercial Invoice",
      isValid: true
    },
    {
      id: 2,
      signatoryName: "Sarah Johnson",
      designation: "Quality Control Officer",
      documentType: "Packing List",
      isValid: false
    },
    {
      id: 3,
      signatoryName: "Michael Brown",
      designation: "Authorized Signatory",
      documentType: "Certificate of Origin",
      isValid: true
    },
    {
      id: 4,
      signatoryName: "Emily Davis",
      designation: "Finance Director",
      documentType: "Bill of Lading",
      isValid: true
    }
  ]);

  const handleValidityToggle = (signatureId, isValid) => {
    setSignatures(prev => 
      prev.map(sig => 
        sig.id === signatureId 
          ? { ...sig, isValid }
          : sig
      )
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          Signature Verification - LC {lcNumber}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Review and verify signatures on submitted documents
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {signatures.map((signature) => (
            <div 
              key={signature.id}
              className={`border rounded-lg p-4 transition-all duration-200 ${
                signature.isValid 
                  ? 'border-green-200 bg-green-50 shadow-sm' 
                  : 'border-red-200 bg-red-50 shadow-sm'
              }`}
            >
              {/* Header with status indicator */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900 text-sm">Signature #{signature.id}</h3>
                <div className={`w-3 h-3 rounded-full ${
                  signature.isValid ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
              </div>

              {/* Signature details */}
              <div className="space-y-2 mb-4">
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Signatory</span>
                  <p className="text-sm font-medium text-gray-900">{signature.signatoryName}</p>
                </div>
                
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Designation</span>
                  <p className="text-sm text-gray-700">{signature.designation}</p>
                </div>
                
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Document</span>
                  <p className="text-sm text-gray-700">{signature.documentType}</p>
                </div>
              </div>

              {/* Validity buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleValidityToggle(signature.id, true)}
                  className={`flex-1 py-2 px-3 rounded text-xs font-medium transition-colors ${
                    signature.isValid
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  Valid
                </button>
                <button
                  onClick={() => handleValidityToggle(signature.id, false)}
                  className={`flex-1 py-2 px-3 rounded text-xs font-medium transition-colors ${
                    !signature.isValid
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  Invalid
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Verification Summary</h3>
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Valid: {signatures.filter(s => s.isValid).length}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span>Invalid: {signatures.filter(s => !s.isValid).length}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
              <span>Total: {signatures.length}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            Save Draft
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors">
            Complete Verification
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignatureVerificationView;