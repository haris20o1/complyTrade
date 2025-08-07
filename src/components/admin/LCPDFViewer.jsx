import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { lcService } from '../authentication/apiAdmin';

const LCPDFViewer = () => {
    const { lcNumber } = useParams();
    const [searchParams] = useSearchParams();
    const [pdfDocuments, setPdfDocuments] = useState([]);
    const [selectedPdfIndex, setSelectedPdfIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [downloadingAll, setDownloadingAll] = useState(false);

    useEffect(() => {
        const fetchAllDocuments = async () => {
            try {
                setLoading(true);
                const allDocuments = [];

                console.log(`Fetching all documents for LC: ${lcNumber}`);

                // Use the new consolidated API
                const response = await lcService.getAllDocuments(lcNumber);
                console.log('API response received:', response);

                // Process consolidated_message (if available)
                if (response.consolidated_message) {
                    allDocuments.push({
                        url: response.consolidated_message,
                        name: `${lcNumber} - Consolidated Swift Message`,
                        type: 'Consolidated',
                        category: 'Consolidated Swift Message',
                        categoryType: 'original'
                    });
                    console.log('Consolidated message added');
                }

                // Process MT700 (original LC document)
                if (response.mt700) {
                    allDocuments.push({
                        url: response.mt700,
                        name: `${lcNumber} - MT700 (Original LC)`,
                        type: 'MT700',
                        category: 'Original Swift Message',
                        categoryType: 'original'
                    });
                    console.log('MT700 document added');
                }

                // Process MT701 amendments
                if (response.mt701 && Array.isArray(response.mt701) && response.mt701.length > 0) {
                    console.log(`Found ${response.mt701.length} MT701 amendments`);
                    response.mt701.forEach((url, index) => {
                        allDocuments.push({
                            url: url,
                            name: `MT701 Amendment ${index + 1}`,
                            type: 'MT701',
                            category: 'MT701 Messages',
                            categoryType: 'amendment'
                        });
                    });
                }

                // Process MT707 amendments
                if (response.mt707 && Array.isArray(response.mt707) && response.mt707.length > 0) {
                    console.log(`Found ${response.mt707.length} MT707 amendments`);
                    response.mt707.forEach((url, index) => {
                        allDocuments.push({
                            url: url,
                            name: `MT707 Amendment ${index + 1}`,
                            type: 'MT707',
                            category: 'MT707 Messages',
                            categoryType: 'amendment'
                        });
                    });
                }

                // Process MT799 amendments
                if (response.mt799 && Array.isArray(response.mt799) && response.mt799.length > 0) {
                    console.log(`Found ${response.mt799.length} MT799 amendments`);
                    response.mt799.forEach((url, index) => {
                        allDocuments.push({
                            url: url,
                            name: `MT799 Amendment ${index + 1}`,
                            type: 'MT799',
                            category: 'MT799 Messages',
                            categoryType: 'amendment'
                        });
                    });
                }

                if (allDocuments.length === 0) {
                    throw new Error('No documents found for this LC');
                }

                console.log(`Total documents loaded: ${allDocuments.length}`);
                setPdfDocuments(allDocuments);
                setError(null);
            } catch (err) {
                console.error(`Failed to fetch documents for ${lcNumber}:`, err);
                setError(`Failed to load documents: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        if (lcNumber) {
            fetchAllDocuments();
        }
    }, [lcNumber]);

    // Function to download a single file
    const downloadFile = async (url, filename) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Download failed:', error);
            // Fallback to simple link download
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    // Function to download all files with delay
    const downloadAllFiles = async () => {
        if (downloadingAll) return;

        setDownloadingAll(true);

        for (let i = 0; i < pdfDocuments.length; i++) {
            const pdf = pdfDocuments[i];
            if (pdf.url) {
                const filename = `${pdf.name || `${lcNumber}_document_${i + 1}`}.pdf`;
                await downloadFile(pdf.url, filename);

                // Add delay between downloads to prevent browser blocking
                if (i < pdfDocuments.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }

        setDownloadingAll(false);
    };

    const handleTabClick = (index) => {
        setSelectedPdfIndex(index);
    };

    // Group documents by category for better organization and maintain order
    const categoryOrder = [
        'Consolidated Swift Message',
        'Original Swift Message',
        'MT701 Messages',
        'MT707 Messages',
        'MT799 Messages',
        'Other'
    ];

    const groupedDocuments = pdfDocuments.reduce((acc, doc, index) => {
        const category = doc.category || 'Other';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push({ ...doc, originalIndex: index });
        return acc;
    }, {});

    // Sort categories according to the desired order
    const sortedGroupedDocuments = {};
    categoryOrder.forEach(category => {
        if (groupedDocuments[category]) {
            sortedGroupedDocuments[category] = groupedDocuments[category];
        }
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
                    <p className="mt-6 text-slate-600 text-lg">Loading documents...</p>
                </div>
            </div>
        );
    }

    if (error || pdfDocuments.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="text-red-500 text-8xl mb-6">📄</div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">
                        {error ? 'Error Loading Documents' : 'No Documents Found'}
                    </h2>
                    <p className="text-slate-600 mb-6 text-lg">
                        {error || 'No documents available for this LC'}
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => {
                                setError(null);
                                setLoading(true);
                                setPdfDocuments([]);
                            }}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Retry
                        </button>
                        <button
                            onClick={() => window.close()}
                            className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium"
                        >
                            Close
                        </button>
                    </div>
                    {error && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-700 text-left">
                                <strong>Error Details:</strong><br />
                                {error}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const currentPdf = pdfDocuments[selectedPdfIndex];

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            {/* Header Bar */}
            <div className="bg-slate-800 border-b border-slate-700 px-0">
                <div className="flex items-center justify-between h-16 px-6">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">LC Documents & Amendments</h1>
                                <p className="text-sm text-slate-400">LC Number: {lcNumber}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="text-sm text-slate-400">
                            {pdfDocuments.length} document{pdfDocuments.length !== 1 ? 's' : ''} loaded
                        </div>
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                            title={sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <button
                            onClick={() => window.close()}
                            className="px-4 py-2 text-slate-400 hover:text-white border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex h-[calc(100vh-64px)]">
                {/* Left Sidebar */}
                <div className={`bg-slate-800 border-r border-slate-700 transition-all duration-300 ${sidebarCollapsed ? 'w-0 overflow-hidden' : 'w-80'} flex flex-col`}>
                    <div className="p-6 flex-1 overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-white">
                                Documents ({pdfDocuments.length})
                            </h3>
                        </div>

                        {/* Document Groups */}
                        <div className="space-y-6">
                            {Object.entries(sortedGroupedDocuments).map(([category, documents]) => (
                                <div key={category} className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <h4 className="text-xs font-medium text-slate-300 uppercase tracking-wider">
                                            {category} ({documents.length})
                                        </h4>
                                    </div>

                                    {documents.map((pdf) => (
                                        <button
                                            key={pdf.originalIndex}
                                            onClick={() => handleTabClick(pdf.originalIndex)}
                                            className={`w-full text-left p-2 rounded-lg transition-all duration-200 ${selectedPdfIndex === pdf.originalIndex
                                                ? 'bg-blue-600 shadow-lg transform scale-[1.02]'
                                                : 'bg-slate-700 hover:bg-slate-600 hover:shadow-md'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-xs font-medium text-white truncate">
                                                        {pdf.name || pdf.title || `Document ${pdf.originalIndex + 1}`}
                                                    </div>
                                                    {pdf.type && (
                                                        <div className="text-sm text-slate-400 mt-1">
                                                            {pdf.type}
                                                        </div>
                                                    )}
                                                    {pdf.size && (
                                                        <div className="text-xs text-slate-500 mt-1">
                                                            {formatFileSize(pdf.size)}
                                                        </div>
                                                    )}
                                                </div>
                                                {selectedPdfIndex === pdf.originalIndex && (
                                                    <div className="text-white ml-3">
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Fixed Action Buttons */}
                    <div className="p-6 border-t border-slate-700 bg-slate-800">
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={downloadAllFiles}
                                disabled={downloadingAll}
                                className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
                            >
                                {downloadingAll ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Downloading...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        <span>Download All</span>
                                    </>
                                )}
                            </button>

                            {currentPdf && currentPdf.url && (
                                <button
                                    onClick={() => downloadFile(currentPdf.url, `${currentPdf.name || `${lcNumber}_current_document`}.pdf`)}
                                    className="px-4 py-1.5 text-xs bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors font-medium flex items-center justify-center space-x-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span>Download Current</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* PDF Viewer */}
                <div className={`flex-1 bg-slate-100 transition-all duration-300 ${sidebarCollapsed ? 'ml-0' : 'ml-0'}`}>
                    {currentPdf && currentPdf.url ? (
                        <iframe
                            src={currentPdf.url}
                            className="w-full h-full border-0"
                            title={`${currentPdf.name || `Document ${selectedPdfIndex + 1}`}`}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-500 bg-slate-100">
                            <div className="text-center">
                                <div className="text-6xl mb-4">📄</div>
                                <p className="text-xl">Document not available</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Helper function to format file size
const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

export default LCPDFViewer;