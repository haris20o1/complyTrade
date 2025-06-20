import React from 'react';
import { Activity } from 'lucide-react';

const Header = ({ 
  lcNumber, 
  lcCompleted, 
  allTabsVisited, 
  navigate, 
  onBackToDashboard, 
  onGenerateReport,
  userRole // ADD this prop
}) => {
  // Determine button text based on role
  const getButtonText = () => {
    if (userRole === 'complyce_manager') {
      return 'Submit';
    }
    return 'Generate final report';
  };

  return (
    <header className="bg-indigo-900 shadow-md sticky top-0 z-10">
      <div className="w-full px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={onBackToDashboard}
              className="mr-3 text-white bg-indigo-900 hover:bg-white/30 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Back to dashboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-white">
              Letter of Credit <span className="bg-indigo-900 px-2 py-1 ml-2 rounded-md text-white">{lcNumber}</span>
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`flex items-center px-3 py-1 rounded-full ${lcCompleted ? 'bg-green-400 text-white' : 'bg-yellow-400 text-white'}`}>
              <span className="text-sm font-medium">
                {lcCompleted ? 'Completed' : 'In Progress'}
              </span>
            </div>
            
            <button
              onClick={() => navigate('/vesseltracking')}
              className="inline-flex items-center px-4 py-2 border border-white/30 text-sm font-medium rounded-md text-white bg-white/20 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white transition-colors"
            >
              <Activity className="h-5 w-5 mr-2" />
              Track Vessel
            </button>

            <button
              onClick={onGenerateReport}
              disabled={!allTabsVisited}
              className={`inline-flex items-center px-12 py-3 border border-white text-sm font-medium rounded-md shadow-md text-white ${
                allTabsVisited
                  ? 'bg-indigo-900 hover:bg-[#646cffaa]/90'
                  : 'bg-gray-400 cursor-not-allowed'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#646cffaa] transition-colors`}
              title={!allTabsVisited ? "Please review all documents first" : getButtonText()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {getButtonText()}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;