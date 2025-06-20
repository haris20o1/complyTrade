
// import React from 'react';

// const PriceVerificationView = ({ lcNumber, priceVerificationData }) => {
//   return (
//     <div className="space-y-6">
//       {/* Price Verification Header */}
//       <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-l-4 border-green-500">
//         <div className="p-5 bg-gradient-to-r from-white to-green-50 border border-gray-300 shadow-2xl rounded-lg">
//           <div className="flex justify-between items-center">
//             <div>
//               <h2 className="text-xl font-bold text-gray-900">Price Verification Analysis</h2>
//               <p className="text-sm text-gray-600 mt-1">
//                 {priceVerificationData.length} products under review for LC #{lcNumber}
//               </p>
//             </div>
//             <div className="flex space-x-2">
//               <div className="text-center px-3 py-1 bg-green-100 rounded-md">
//                 <span className="text-xs text-green-800 font-medium">Verified</span>
//                 <p className="text-lg font-bold text-green-600">
//                   {priceVerificationData.filter(item => Math.abs(item.estimatedValue - item.proposedValue) <= item.estimatedValue * 0.05).length}
//                 </p>
//               </div>
//               <div className="text-center px-3 py-1 bg-yellow-100 rounded-md">
//                 <span className="text-xs text-yellow-800 font-medium">Under Review</span>
//                 <p className="text-lg font-bold text-yellow-600">
//                   {priceVerificationData.filter(item => Math.abs(item.estimatedValue - item.proposedValue) > item.estimatedValue * 0.05).length}
//                 </p>
//               </div>
//               <div className="text-center px-3 py-1 bg-blue-100 rounded-md">
//                 <span className="text-xs text-blue-800 font-medium">Total Value</span>
//                 <p className="text-lg font-bold text-blue-600">
//                   ${priceVerificationData.reduce((sum, item) => sum + item.proposedValue, 0).toLocaleString()}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Price Verification Table */}
//       <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//         <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
//           <h3 className="text-lg font-bold text-gray-800">Product Price Analysis</h3>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-indigo-900">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
//                   Product Name
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
//                   HS Code
//                 </th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
//                   Estimated Value
//                 </th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
//                   Proposed Value
//                 </th>
//                 <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
//                   Variance
//                 </th>
//                 <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
//                   Dual Use Item
//                 </th>
//                 <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
//                   Is Sanctioned
//                 </th>
//                 <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
//                   Is Money Laundering
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {priceVerificationData.map((item, index) => {
//                 const variance = ((item.proposedValue - item.estimatedValue) / item.estimatedValue * 100);
//                 const isHighVariance = Math.abs(variance) > 5;

//                 return (
//                   <tr key={index} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {item.productName}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
//                       {item.hsCode}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
//                       ${item.estimatedValue.toLocaleString()}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
//                       ${item.proposedValue.toLocaleString()}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-center">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         isHighVariance
//                           ? variance > 0
//                             ? 'bg-red-100 text-red-800'
//                             : 'bg-yellow-100 text-yellow-800'
//                           : 'bg-green-100 text-green-800'
//                       }`}>
//                         {variance > 0 ? '+' : ''}{variance.toFixed(1)}%
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-center">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         item.dualUseItem === 'Yes'
//                           ? 'bg-yellow-100 text-yellow-800'
//                           : 'bg-green-100 text-green-800'
//                       }`}>
//                         {item.dualUseItem}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-center">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         item.isSanctioned === 'Yes'
//                           ? 'bg-red-100 text-red-800'
//                           : 'bg-green-100 text-green-800'
//                       }`}>
//                         {item.isSanctioned}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-center">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         item.isMoneyLaundering === 'Yes'
//                           ? 'bg-red-100 text-red-800'
//                           : 'bg-green-100 text-green-800'
//                       }`}>
//                         {item.isMoneyLaundering}
//                       </span>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PriceVerificationView;


import React from 'react';

const PriceVerificationView = ({ lcNumber, priceVerificationData }) => {
  // Debug: Log the data to see what we're receiving
  console.log('Price Verification Data:', priceVerificationData);
  console.log('LC Number:', lcNumber);
  console.log('Data type:', typeof priceVerificationData);
  console.log('Is Array:', Array.isArray(priceVerificationData));
  console.log('Data length:', priceVerificationData?.length);

  // Handle empty or undefined data
  if (!priceVerificationData || !Array.isArray(priceVerificationData) || priceVerificationData.length === 0) {
    return (
      <div className="space-y-6">
        {/* Price Verification Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-l-4 border-yellow-500">
          <div className="p-5 bg-gradient-to-r from-white to-yellow-50 border border-gray-300 shadow-2xl rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Price Verification Analysis</h2>
                <p className="text-sm text-gray-600 mt-1">
                  No price verification data available for LC #{lcNumber}
                </p>
              </div>
              <div className="flex space-x-2">
                <div className="text-center px-3 py-1 bg-gray-100 rounded-md">
                  <span className="text-xs text-gray-800 font-medium">Status</span>
                  <p className="text-lg font-bold text-gray-600">No Data</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Information */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-semibold mb-2">Debug Information:</h3>
          <ul className="text-sm text-red-700 space-y-1">
            <li>LC Number: {lcNumber || 'undefined'}</li>
            <li>Data Type: {typeof priceVerificationData}</li>
            <li>Is Array: {Array.isArray(priceVerificationData) ? 'Yes' : 'No'}</li>
            <li>Data Length: {priceVerificationData?.length || 'undefined'}</li>
            <li>Raw Data: {JSON.stringify(priceVerificationData)}</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Price Verification Header */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-l-4 border-green-500">
        <div className="p-5 bg-gradient-to-r from-white to-green-50 border border-gray-300 shadow-2xl rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Price Verification Analysis</h2>
              <p className="text-sm text-gray-600 mt-1">
                {priceVerificationData.length} products under review for LC #{lcNumber}
              </p>
            </div>
            <div className="flex space-x-2">
              <div className="text-center px-3 py-1 bg-green-100 rounded-md">
                <span className="text-xs text-green-800 font-medium">Verified</span>
                <p className="text-lg font-bold text-green-600">
                  {priceVerificationData.filter(item => Math.abs(item.estimatedValue - item.proposedValue) <= item.estimatedValue * 0.05).length}
                </p>
              </div>
              <div className="text-center px-3 py-1 bg-yellow-100 rounded-md">
                <span className="text-xs text-yellow-800 font-medium">Under Review</span>
                <p className="text-lg font-bold text-yellow-600">
                  {priceVerificationData.filter(item => Math.abs(item.estimatedValue - item.proposedValue) > item.estimatedValue * 0.05).length}
                </p>
              </div>
              <div className="text-center px-3 py-1 bg-blue-100 rounded-md">
                <span className="text-xs text-blue-800 font-medium">Total Value</span>
                <p className="text-lg font-bold text-blue-600">
                  ${priceVerificationData.reduce((sum, item) => sum + item.proposedValue, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Information (for development) */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-blue-800 font-semibold mb-2">Debug Information:</h3>
        <div className="text-sm text-blue-700">
          <p>Data loaded successfully with {priceVerificationData.length} items</p>
          <details className="mt-2">
            <summary className="cursor-pointer">Show raw data</summary>
            <pre className="mt-2 bg-white p-2 rounded text-xs overflow-x-auto">
              {JSON.stringify(priceVerificationData, null, 2)}
            </pre>
          </details>
        </div>
      </div>

      {/* Price Verification Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800">Product Price Analysis</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  HS Code
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                  Estimated Value
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                  Proposed Value
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                  Variance
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                  Dual Use Item
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                  Is Sanctioned
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                  Is Money Laundering
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {priceVerificationData.map((item, index) => {
                const variance = ((item.proposedValue - item.estimatedValue) / item.estimatedValue * 100);
                const isHighVariance = Math.abs(variance) > 5;

                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.productName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {item.hsCode || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      ${(item.estimatedValue || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      ${(item.proposedValue || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isHighVariance
                          ? variance > 0
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {variance > 0 ? '+' : ''}{variance.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.dualUseItem === 'Yes'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {item.dualUseItem || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.isSanctioned === 'Yes'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {item.isSanctioned || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.isMoneyLaundering === 'Yes'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {item.isMoneyLaundering || 'N/A'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PriceVerificationView;
