// File: src/components/filters/FilterDropdown.jsx
import React, { useState } from 'react';
import { ChevronDownIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

const FilterDropdown = ({ filters, onApply, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterValues, setFilterValues] = useState({});

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleFilterChange = (filterKey, value) => {
    setFilterValues(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const handleApply = () => {
    onApply(filterValues);
    setIsOpen(false);
  };

  const handleClear = () => {
    setFilterValues({});
    onClear();
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleToggle}
        className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
      >
        <FunnelIcon className="h-4 w-4 mr-2" />
        Filters
        <ChevronDownIcon className="h-4 w-4 ml-2" />
      </button>
  
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-96 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"> {/* Changed from w-72 to w-96 */}
          <div className="py-2 px-4">
            <div className="flex justify-between items-center border-b pb-2 mb-3">
              <h3 className="text-sm font-medium text-gray-700">Filter Options</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-500">
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
  
            <div className="space-y-4">
              {filters.map((filter) => (
                <div key={filter.key} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {filter.label}
                  </label>
                  
                  {filter.type === 'select' && (
                    <select
                      value={filterValues[filter.key] || ''}
                      onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                      className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md" // Changed text-base to text-sm
                    >
                      <option value="">All</option>
                      {filter.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                  
                  {filter.type === 'date' && (
                    <div className="flex flex-col space-y-2">
                      <div className="grid grid-cols-2 gap-3"> {/* Increased gap from gap-2 to gap-3 */}
                        <div className="relative">
                          <input
                            type="date"
                            value={filterValues[`${filter.key}From`] || ''}
                            onChange={(e) => handleFilterChange(`${filter.key}From`, e.target.value)}
                            className="w-full pl-2 pr-8 py-1.5 text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" // Added pl-2
                          />
                          <span className="absolute right-2 top-2 text-xs text-gray-400 pointer-events-none">
                            From
                          </span>
                        </div>
                        <div className="relative">
                          <input
                            type="date"
                            value={filterValues[`${filter.key}To`] || ''}
                            onChange={(e) => handleFilterChange(`${filter.key}To`, e.target.value)}
                            className="w-full pl-2 pr-8 py-1.5 text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" // Added pl-2
                          />
                          <span className="absolute right-2 top-2 text-xs text-gray-400 pointer-events-none">
                            To
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
  
            <div className="mt-4 flex justify-end space-x-2 pt-3 border-t">
              <button
                onClick={handleClear}
                className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                Clear
              </button>
              <button
                onClick={handleApply}
                className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;