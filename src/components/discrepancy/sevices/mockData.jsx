// Mock data for LC Support Documents and Discrepancies
export const mockLCSupportDocsData = {
    "001": [
      {
        doc_uuid: "doc-001",
        doc_title: "Commercial Invoice",
        discrepancies: [
          {
            id: 1,
            issue: "Invoice amount exceeds LC amount by $2,500",
            status: "pending",
            remarks: ""
          },
          {
            id: 2,
            issue: "Invoice date is beyond shipment date",
            status: "pending", 
            remarks: ""
          },
          {
            id: 3,
            issue: "Beneficiary name mismatch in invoice",
            status: "clean",
            remarks: "Verified with original LC"
          }
        ]
      },
      {
        doc_uuid: "doc-002",
        doc_title: "Bill of Lading",
        discrepancies: [
          {
            id: 4,
            issue: "Port of loading differs from LC terms",
            status: "discripant",
            remarks: "Need approval from applicant"
          },
          {
            id: 5,
            issue: "Notify party address incomplete",
            status: "pending",
            remarks: ""
          }
        ]
      },
      {
        doc_uuid: "doc-003", 
        doc_title: "Packing List",
        discrepancies: [
          {
            id: 6,
            issue: "Total packages count mismatch",
            status: "review",
            remarks: "Requires senior review"
          },
          {
            id: 7,
            issue: "Weight specification not matching",
            status: "pending",
            remarks: ""
          },
          {
            id: 8,
            issue: "Product description inconsistent with LC",
            status: "clean",
            remarks: "Acceptable variation"
          }
        ]
      },
      {
        doc_uuid: "doc-004",
        doc_title: "Certificate of Origin",
        discrepancies: [
          {
            id: 9,
            issue: "Certificate not properly endorsed",
            status: "discripant",
            remarks: "Requires re-submission"
          }
        ]
      }
    ],
    "008": [
      {
        doc_uuid: "doc-005",
        doc_title: "Commercial Invoice",
        discrepancies: [
          {
            id: 10,
            issue: "Currency code mismatch",
            status: "pending",
            remarks: ""
          }
        ]
      }
    ],
    "009": [
      {
        doc_uuid: "doc-006",
        doc_title: "Insurance Certificate",
        discrepancies: [
          {
            id: 11,
            issue: "Insurance amount insufficient",
            status: "discripant",
            remarks: "Minimum 110% of invoice value required"
          },
          {
            id: 12,
            issue: "Insurance validity period expired",
            status: "pending",
            remarks: ""
          }
        ]
      }
    ]
  };
  
  // Mock LC Timeline Data
  export const mockLCTimelineData = [
    {
      lcNumber: "LC001",
      status: "Under Review",
      createdDate: "2024-01-15",
      lastUpdated: "2024-01-20",
      assignedTo: "John Doe",
      priority: "High"
    },
    {
      lcNumber: "LC002", 
      status: "Completed",
      createdDate: "2024-01-10",
      lastUpdated: "2024-01-18",
      assignedTo: "Jane Smith",
      priority: "Medium"
    },
    {
      lcNumber: "LC003",
      status: "Pending",
      createdDate: "2024-01-22",
      lastUpdated: "2024-01-22",
      assignedTo: "Mike Johnson",
      priority: "Low"
    }
  ];
  
  // Mock Price Verification Data
  export const mockPriceVerificationData = {
    "LC001": [
      {
        productName: "Premium Steel Coils",
        hsCode: "7208.10.00",
        estimatedValue: 45000,
        proposedValue: 47500,
        dualUseItem: "No",
        isSanctioned: "No",
        isMoneyLaundering: "No"
      },
      {
        productName: "Industrial Machinery Parts",
        hsCode: "8431.39.90",
        estimatedValue: 23000,
        proposedValue: 22800,
        dualUseItem: "Yes",
        isSanctioned: "No",
        isMoneyLaundering: "No"
      },
      {
        productName: "Electronic Components",
        hsCode: "8542.31.00",
        estimatedValue: 18500,
        proposedValue: 19200,
        dualUseItem: "Yes",
        isSanctioned: "No",
        isMoneyLaundering: "No"
      }
    ],
    "LC002": [
      {
        productName: "Textile Materials",
        hsCode: "5208.11.00",
        estimatedValue: 12000,
        proposedValue: 12500,
        dualUseItem: "No",
        isSanctioned: "No", 
        isMoneyLaundering: "No"
      }
    ],
    "LC003": [
      {
        productName: "Chemical Products",
        hsCode: "2905.11.00",
        estimatedValue: 35000,
        proposedValue: 34800,
        dualUseItem: "Yes",
        isSanctioned: "Yes",
        isMoneyLaundering: "No"
      }
    ]
  };