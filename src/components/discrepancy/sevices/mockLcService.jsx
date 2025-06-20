import { 
    mockLCSupportDocsData, 
    mockLCTimelineData, 
    mockPriceVerificationData 
  } from './mockData';
  
  // Simulate API delay
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  // Mock LC Service with dummy data
  export const mockLcService = {
    // Get LC Support Documents and Discrepancies
    getLCSupportDocsDiscrepancies: async (lcNumber) => {
      try {
        // Simulate API delay
        await delay(1000);
        
        console.log(`Fetching support docs for LC: ${lcNumber}`);
        
        const data = mockLCSupportDocsData[lcNumber];
        
        if (!data) {
          throw new Error(`No data found for LC: ${lcNumber}`);
        }
        
        return data;
      } catch (error) {
        console.error(`Error fetching support docs discrepancies for ${lcNumber}:`, error);
        throw error;
      }
    },
  
    // Update LC Discrepancies
    updateLCDiscrepancies: async (complete, docUpdates) => {
      try {
        // Simulate API delay
        await delay(500);
        
        console.log('Updating LC discrepancies with data:', {
          complete,
          docUpdates
        });
        
        // Simulate success response
        return {
          success: true,
          message: complete ? 'Final report generated successfully' : 'Draft saved successfully',
          data: docUpdates
        };
      } catch (error) {
        console.error('Error updating LC discrepancies:', error);
        throw error;
      }
    },
  
    // Get LC Timeline
    getLCTimeline: async () => {
      try {
        // Simulate API delay
        await delay(800);
        
        console.log('Fetching LC timeline data');
        
        return mockLCTimelineData;
      } catch (error) {
        console.error('Error fetching LC timeline:', error);
        throw error;
      }
    },
  
    // Update individual discrepancy
    updateDiscrepancy: async (lcNumber, discrepancyId, data) => {
      try {
        // Simulate API delay
        await delay(300);
        
        console.log(`Updating discrepancy ${discrepancyId} for LC ${lcNumber}:`, data);
        
        return {
          success: true,
          message: 'Discrepancy updated successfully',
          discrepancyId,
          data
        };
      } catch (error) {
        console.error(`Error updating discrepancy ${discrepancyId} for LC ${lcNumber}:`, error);
        throw error;
      }
    },
  
    // Add new discrepancy
    addDiscrepancy: async (lcNumber, docUuid, data) => {
      try {
        // Simulate API delay
        await delay(400);
        
        console.log(`Adding discrepancy to doc ${docUuid} for LC ${lcNumber}:`, data);
        
        // Generate a random ID for the new discrepancy
        const newId = Math.floor(Math.random() * 10000) + 1000;
        
        return {
          success: true,
          message: 'Discrepancy added successfully',
          discrepancy: {
            id: newId,
            ...data,
            status: 'pending',
            remarks: ''
          }
        };
      } catch (error) {
        console.error(`Error adding discrepancy to doc ${docUuid} for LC ${lcNumber}:`, error);
        throw error;
      }
    },
  
    // Delete LC
    deleteLC: async (lcNumber) => {
      try {
        // Simulate API delay
        await delay(600);
        
        console.log(`Deleting LC: ${lcNumber}`);
        
        return {
          success: true,
          message: `LC ${lcNumber} deleted successfully`
        };
      } catch (error) {
        console.error(`Error deleting LC ${lcNumber}:`, error);
        throw error;
      }
    },
  
    // Get Price Verification Data (if needed)
    getPriceVerificationData: async (lcNumber) => {
        try {
          await delay(700);
          
          console.log(`Fetching price verification data for LC: ${lcNumber}`);
          
          // Try different key formats
          let data = mockPriceVerificationData[lcNumber] || 
                     mockPriceVerificationData[`LC${lcNumber}`] ||
                     mockPriceVerificationData[lcNumber.padStart(3, '0')];
          
          if (!data) {
            console.warn(`No price verification data found for LC: ${lcNumber}`);
            return []; // Return empty array instead of throwing error
          }
          
          return data;
        } catch (error) {
          console.error(`Error fetching price verification data for ${lcNumber}:`, error);
          return []; // Return empty array on error
        }
      }
  };