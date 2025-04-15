import React, { useState, useMemo } from 'react';

const DataTable = ({ columns, data, onRowAction, actionColumn }) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });
  const [filters, setFilters] = useState({});

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Apply filters to data
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Check if item passes all filters
      for (const [key, value] of Object.entries(filters)) {
        if (!value || value === '') continue; // Skip empty filters
        
        // Date range filter
        if (key.endsWith('From') || key.endsWith('To')) {
          const baseKey = key.replace('From', '').replace('To', '');
          const dateValue = new Date(item[baseKey]);
          
          if (key.endsWith('From') && filters[key]) {
            const fromDate = new Date(filters[key]);
            if (dateValue < fromDate) return false;
          }
          
          if (key.endsWith('To') && filters[key]) {
            const toDate = new Date(filters[key]);
            if (dateValue > toDate) return false;
          }
          
          continue;
        }
        
        // Handle assignedTo (object with name property)
        if (key === 'assignedTo' && item[key]) {
          if (item[key].name !== value) return false;
          continue;
        }
        
        // Standard string comparison
        if (item[key] !== value) return false;
      }
      return true;
    });
  }, [data, filters]);

  // Apply sorting to filtered data
  const sortedData = useMemo(() => {
    let sortableData = [...filteredData];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        // Handle nested properties like assignedTo.name
        const aValue = sortConfig.key.includes('.') ? 
          sortConfig.key.split('.').reduce((obj, key) => obj && obj[key], a) : 
          a[sortConfig.key];
          
        const bValue = sortConfig.key.includes('.') ? 
          sortConfig.key.split('.').reduce((obj, key) => obj && obj[key], b) : 
          b[sortConfig.key];
          
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [filteredData, sortConfig]);

  // Update filters
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort(column.key)}
              >
                <div className="flex items-center">
                  {column.header}
                  {sortConfig.key === column.key && (
                    <span className="ml-2">
                      {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
            {actionColumn && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.length > 0 ? (
            sortedData.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
                {actionColumn && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    {actionColumn(row, onRowAction)}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + (actionColumn ? 1 : 0)} className="px-6 py-4 text-center text-sm text-gray-500">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;