import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const LCDetails = () => {

    const navigate = useNavigate();
    // Use useParams to get the lcNumber from URL parameters
    const { lcNumber } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasSupportingDocs, setHasSupportingDocs] = useState(true);
  const [newSubPoint, setNewSubPoint] = useState("");
  const [selectedSubPoint, setSelectedSubPoint] = useState(null);
  const [mainPoints, setMainPoints] = useState([]);
  const [lcCompleted, setLcCompleted] = useState(false);
  const [missingDocumentStatus, setMissingDocumentStatus] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Mock data to replace API call
  const generateDummyData = (lcNumber) => {
    return {
      lcNumber,
      missing_document_status: false,
      discrepancies: [
        {
          doc_uuid: "doc-001",
          doc_title: "Commercial Invoice Commercial Invoice Commercial Invoice Commercial Invoice Commercial InvoiceV Commercial Invoice Commercial Invoice Commercial Invoice Commercial Invoice Commercial Invoice Commercial InvoiceV Commercial Invoice",
          discrepancies: [
            { id: 1, issue: "Invoice amount doesn't match LC value", status: "discripant", remarks: "Amount is $5000 instead of $4500" },
            { id: 2, issue: "Missing beneficiary signature", status: "clean", remarks: "" },
          ]
        },
        {
          doc_uuid: "doc-002",
          doc_title: "Bill of Lading",
          discrepancies: [
            { id: 4, issue: "Late shipment date", status: "discripant", remarks: "Shipped on 12/15 instead of 12/10" },
            { id: 5, issue: "Inconsistent goods description", status: "reassign", remarks: "Need clarification from shipper" },
            { id: 6, issue: "Missing vessel details", status: "clean", remarks: "" }
          ]
        },
        {
          doc_uuid: "doc-004",
          doc_title: "Certificate of Origin",
          discrepancies: [
            { id: 7, issue: "Country of origin doesn't match requirements", status: "discripant", remarks: "Listed as China instead of Vietnam" },
            { id: 8, issue: "Incorrect HS code", status: "clean", remarks: "" }
          ]
        }
      ]
    };
  };

  useEffect(() => {
    // Simulate API call with dummy data
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const data = generateDummyData(lcNumber);
        
        if (!data || !data.discrepancies) {
          setHasSupportingDocs(false);
          setError('No supporting documents available for this LC');
          return;
        }
        
        setMissingDocumentStatus(data.missing_document_status);
        
        const initializedPoints = data.discrepancies.map(doc => ({
            doc_uuid: doc.doc_uuid,
            text: doc.doc_title || 'Untitled Document',
            subPoints: doc.discrepancies?.map(d => ({
              id: d.id,
              text: d.issue,
              status: d.status,
              remarks: d.remarks || "" // Add remarks property
            })) || []
          }));
        
        setMainPoints(initializedPoints);
    


        const savedStatus = localStorage.getItem(`lc-${lcNumber}-completed`);
        if (savedStatus) {
          setLcCompleted(savedStatus === 'true');
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setHasSupportingDocs(false);
        setError('Failed to load LC data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [lcNumber]);

  const handleRemarksChange = (mainIndex, subPointId, value) => {
    const updatedMainPoints = [...mainPoints];
    const subPointIndex = updatedMainPoints[mainIndex].subPoints.findIndex(
      sp => sp.id === subPointId
    );
    
    if (subPointIndex !== -1) {
      updatedMainPoints[mainIndex].subPoints[subPointIndex].remarks = value;
      setMainPoints(updatedMainPoints);
    }
};

  const checkAllSubpointsDiscrepant = () => {
    return mainPoints.every(mainPoint => 
      mainPoint.subPoints.every(subPoint => subPoint.status === 'discripant')
    );
  };

  const isStatusCheckboxEnabled = () => {
    return !missingDocumentStatus && checkAllSubpointsDiscrepant();
  };

  const handleSelection = (mainIndex, subPointId, value) => {
    const updatedMainPoints = [...mainPoints];
    const subPointIndex = updatedMainPoints[mainIndex].subPoints.findIndex(
      sp => sp.id === subPointId
    );
    
    if (subPointIndex !== -1) {
      let newStatus = '';
      switch (value) {
        case 'NO':
          newStatus = 'clean';
          break;
        case 'YES':
          newStatus = 'discripant';
          break;
        case 'RA':
          newStatus = 'reassign';
          break;
        default:
          newStatus = '';
      }
  
      updatedMainPoints[mainIndex].subPoints[subPointIndex].status = newStatus;
      setMainPoints(updatedMainPoints);
    }
  };

  const addSubPoint = (mainIndex) => {
    if (newSubPoint.trim() !== "") {
        const updatedMainPoints = [...mainPoints];
        const newId = -Math.floor(Math.random() * 10000);
        updatedMainPoints[mainIndex].subPoints.push({
        id: newId,
        text: newSubPoint,
        status: 'clean',
        remarks: ""  // Initialize with empty remarks
        });
        setMainPoints(updatedMainPoints);
        setNewSubPoint("");
    }
    };

  const deleteSubPoint = () => {
    if (selectedSubPoint) {
      const { mainIndex, subPointId } = selectedSubPoint;
      const updatedMainPoints = [...mainPoints];
      updatedMainPoints[mainIndex].subPoints = updatedMainPoints[mainIndex].subPoints.filter(
        sp => sp.id !== subPointId
      );
      setMainPoints(updatedMainPoints);
      setSelectedSubPoint(null);
    }
  };

  const saveToPDF = () => {
    alert("PDF export functionality would go here. This requires html2canvas and jsPDF libraries.");
  };

  const handleBackToDashboard = () => {
    navigate('/completed');
  };

  const remainingCount = mainPoints.reduce((count, mp) => 
    count + mp.subPoints.filter(sp => sp.status !== 'discripant').length, 0);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-700"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-yellow-50 text-yellow-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">LC #{lcNumber}</h1>
            <div className="text-lg text-red-600 font-medium">
              {error}
            </div>
          </div>
          <button 
            onClick={handleBackToDashboard}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Main content
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Full width, colorful */}
      <header className="bg-indigo-800 shadow-md sticky top-0 z-10">
        <div className="w-full px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button 
                onClick={handleBackToDashboard}
                className="mr-3 text-white bg-indigo-800 hover:bg-white/30 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Back to dashboard"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-white">
                Letter of Credit <span className="bg-indigo-800 px-2 py-1 ml-2 rounded-md text-white">{lcNumber}</span>
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`flex items-center px-3 py-1 rounded-full ${lcCompleted ? 'bg-green-400 text-white' : 'bg-yellow-400 text-white'}`}>
                <span className="text-sm font-medium">
                  {lcCompleted ? 'Completed' : 'In Progress'}
                </span>
              </div>
              <button
                onClick={saveToPDF}
                className="inline-flex items-center px-4 py-2 border border-white/30 text-sm font-medium rounded-md text-white bg-white/20 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </header>
      
  
      {/* Main Content - Full-width layout with sidebar */}
      <div className="flex w-full">
        
        {/* Left Sidebar - Fixed width with colorful elements */}
        <div className="w-64 bg-gray-300 border-r border-gray-200 min-h-screen">
          {/* Status Box */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r bg-indigo-800 bg-indigo-800]">
            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                id="lc-completed"
                checked={lcCompleted}
                onChange={(e) => {
                  if (isStatusCheckboxEnabled()) {
                    setLcCompleted(e.target.checked);
                    localStorage.setItem(`lc-${lcNumber}-completed`, e.target.checked);
                  }
                }}
                disabled={!isStatusCheckboxEnabled()}
                className={`h-5 w-5 rounded border-gray-300 bg-indigo-800 focus:ring-[#646cffaa] ${
                  !isStatusCheckboxEnabled() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              />
              <label 
                htmlFor="lc-completed" 
                className="ml-3 text-sm font-bold text-white"
              >
                Mark as Complete
              </label>
            </div>
            {!isStatusCheckboxEnabled() && (
              <div className="text-xs text-white/90 bg-indigo-800 p-2 rounded-md">
                {missingDocumentStatus
                  ? "Missing supporting documents"
                  : `${remainingCount} issues need resolution`}
              </div>
            )}
          </div>
  
          {/* Document Navigation */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-sm font-bold text-gray-900 mb-3">Documents</h2>
            <div className="space-y-1">
              {mainPoints.map((point, index) => (
                <button
                  key={point.doc_uuid}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-between ${
                    activeTab === index
                      ? 'bg-indigo-800 text-white'
                      : 'text-gray-700 hover:bg-[#646cffaa]/10 hover:text-[#646cffaa]'
                  }`}
                  onClick={() => setActiveTab(index)}
                >
                  <span className="truncate">{point.text}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    activeTab === index ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {point.subPoints.length}
                  </span>
                </button>
              ))}
            </div>
          </div>
  
          {/* Legend */}
          <div className="p-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Legend</h3>
            <div className="space-y-3">
              <div className="flex items-center p-2 bg-green-50 rounded-2xl">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-green-500 text-white mr-2 text-xs font-bold">NO</span>
                <span className="text-sm text-green-700">No discrepancy</span>
              </div>
              <div className="flex items-center p-2 bg-red-50 rounded-2xl">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-red-500 text-white mr-2 text-xs font-bold">YES</span>
                <span className="text-sm text-red-700">Discrepancy confirmed</span>
              </div>
              <div className="flex items-center p-2 bg-yellow-50 rounded-2xl">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-yellow-500 text-white mr-2 text-xs font-bold">RA</span>
                <span className="text-sm text-yellow-700">Reassignment needed</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Content Area - Expands to fill remaining width */}
        <div className="flex-1 p-6">
          {/* Add this right after the header, before the main content div */}
<div className="bg-white p-4 flex justify-end shadow-sm">
  <button className="inline-flex items-center px-12 py-3 border border-transparent text-sm font-medium rounded-md shadow-md text-white bg-indigo-800 hover:bg-[#646cffaa]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#646cffaa] transition-colors">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
    Submit
  </button>
</div>
          
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#646cffaa]"></div>
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg shadow-lg p-8 border border-red-100">
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-500 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">LC #{lcNumber}</h1>
                <div className="text-lg text-red-600 font-medium mb-6">
                  {error}
                </div>
                <button 
                  onClick={handleBackToDashboard}
                  className="bg-indigo-800 hover:bg-[#646cffaa]/90 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center transition-colors mx-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <>
              {mainPoints.map((mainPoint, mainIndex) => (
                <div 
                  key={mainPoint.doc_uuid} 
                  className={`${activeTab === mainIndex ? 'block' : 'hidden'}`}
                >
                  {/* Document Header Card */}
                  <div className="mb-6 bg-white rounded-2xl shadow-lg overflow-hidden border-l-4 border-[#646cffaa]">
                  <div className="p-5 bg-gradient-to-r from-white to-[#646cffaa] border border-gray-300 shadow-2xl rounded-lg ">

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
                            <span className="text-xs text-green-800 font-medium">Clean</span>
                            <p className="text-lg font-bold text-green-600">
                              {mainPoint.subPoints.filter(sp => sp.status === 'clean').length}
                            </p>
                          </div>
                          <div className="text-center px-3 py-1 bg-red-100 rounded-md">
                            <span className="text-xs text-red-800 font-medium">Discrepant</span>
                            <p className="text-lg font-bold text-red-600">
                              {mainPoint.subPoints.filter(sp => sp.status === 'discripant').length}
                            </p>
                          </div>
                          <div className="text-center px-3 py-1 bg-yellow-100 rounded-md">
                            <span className="text-xs text-yellow-800 font-medium">Reassign</span>
                            <p className="text-lg font-bold text-yellow-600">
                              {mainPoint.subPoints.filter(sp => sp.status === 'reassign').length}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
  
                  {/* Issues Section */}
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
                    <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-gray-800">Issues & Discrepancies</h3>
                      
                      {selectedSubPoint && selectedSubPoint.mainIndex === mainIndex && (
                        <button
                          onClick={deleteSubPoint}
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
                        <thead className="bg-indigo-700">
                            <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-2/5">
                                Issue Description
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-2/5">
                                Remarks
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                NO
                                </span>
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                YES
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
                                onClick={() => setSelectedSubPoint({
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
                                            onChange={(e) => handleRemarksChange(mainIndex, subPoint.id, e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-white"
                                            placeholder="Add remarks..."
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        {subPoint.remarks && (
                                            <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemarksChange(mainIndex, subPoint.id, '');
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
                                        onChange={() => handleSelection(mainIndex, subPoint.id, 'NO')}
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
                                        onChange={() => handleSelection(mainIndex, subPoint.id, 'YES')}
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
                                        checked={subPoint.status === 'reassign'}
                                        onChange={() => handleSelection(mainIndex, subPoint.id, 'RA')}
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
                          onChange={(e) => setNewSubPoint(e.target.value)}
                          placeholder="Add a new issue..."
                          className="flex-1 min-w-0 block w-full px-4 py-3 rounded-l-md border border-gray-300 focus:outline-none focus:ring-[#646cffaa] focus:border-[#646cffaa] sm:text-sm"
                        />
                        <button
                          onClick={() => addSubPoint(mainIndex)}
                          className="inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-800 hover:bg-[#646cffaa]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#646cffaa] transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add Issue
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4 mt-8">
                    <button className="inline-flex items-center px-5 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#646cffaa] transition-colors shadow-sm">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default LCDetails;