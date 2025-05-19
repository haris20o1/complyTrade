// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

// import { BrowserRouter as Router, Routes, Route,Navigate } from "react-router-dom";
// import LoginScreen from "./components/auth/LoginScreen";
// import SwiftUploadPanel from "./components/swift/SwiftUploadPanel";
// import LCSupportingDocsUploader from "./components/documents/LCSupportingDocsUploader";
// import SignupScreen from "./components/auth/SignupScreen";
// import Admin1 from "./components/admin/admin1";
// import UploadedLCPage from './components/admin/UploadedLCPage';
// import AssignedLCPage from './components/admin/AssignedLCPage';
// import CompletedLCPage from './components/admin/CompletedLCPage';
// import LCDetails from "./components/discrepancy/LCDetails";
// import LCTimelinePage from "./components/admin/LCTimelinePage";
// import ManagerDashboard from "./components/ComplianceManager/Dashboardd";
// import CompletedLCs from "./components/ComplianceManager/Completed";
// import Discrepancy from "./components/ComplianceManager/Discrepancy";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LoginScreen />} />
//         <Route path="/signup" element={<SignupScreen />} />
//         <Route path="/swift-upload" element={<SwiftUploadPanel />} />
//         <Route path="/supporting-docs" element={<LCSupportingDocsUploader />} />
//         <Route path="/dashboard" element={<Admin1 />} />
//         <Route path="/uploaded" element={<UploadedLCPage />} />
//         <Route path="/assigned" element={<AssignedLCPage />} />
//         <Route path="/completed" element={<CompletedLCPage />} />
//         <Route path="/discrepencies/:lcNumber" element={<LCDetails />} />
//         <Route path="/timeline" element={<LCTimelinePage />} />
//         <Route path="/timeline" element={<LCTimelinePage />} />
//         <Route path="/dashboardd" element={<ManagerDashboard />} />
//         <Route path="/complete" element={<CompletedLCs />} />
//         <Route path="/discrepency/:lcNumber" element={<Discrepancy />} />
//         {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
//       </Routes>
//     </Router>
//   );
// }

// export default App;

// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginScreen from "./components/auth/LoginScreen";
import SwiftUploadPanel from "./components/swift/SwiftUploadPanel";
import LCSupportingDocsUploader from "./components/documents/LCSupportingDocsUploader";
import SignupScreen from "./components/auth/SignupScreen";
import Admin1 from "./components/admin/admin1";
import UploadedLCPage from './components/admin/UploadedLCPage';
import AssignedLCPage from './components/admin/AssignedLCPage';
import CompletedLCPage from './components/admin/CompletedLCPage';
import LCDetails from "./components/discrepancy/LCDetails";
import LCTimelinePage from "./components/admin/LCTimelinePage";
import ManagerDashboard from "./components/ComplianceManager/Dashboardd";
import CompletedLCs from "./components/ComplianceManager/Completed";
import Discrepancy from "./components/ComplianceManager/Discrepancy";
import UnauthorizedPage from "./components/common/UnauthorizedPage";
import { ProtectedRoute, RoleBasedRoute, AuthRedirectRoute } from "./components/auth/ProtectedRoutes";
import UserManagement from "./components/IT_Manager/ITusers";
import BankPolicyUploadPage from "./components/IT_Manager/policies";
import RequestAuditPage from "./components/IT_Manager/ITaudit";
import SuperAdminAudits from "./components/SuperAdmin/SuperAdminDashboard";
import UserPerformanceDashboard from "./components/SuperAdmin/UserPerformance";
// import AuditRequestsPage from "./components/SuperAdmin/SuperAdminDashboard";
// import AuditRequestsPage from "./components/SuperAdmin/SuperAdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes that redirect logged-in users */}
        <Route element={<AuthRedirectRoute />}>
          <Route path="/" element={<LoginScreen />} />
          <Route path="/signup" element={<SignupScreen />} />
        </Route>
        
        {/* Protected routes (require authentication) */}
        <Route element={<ProtectedRoute />}>
          {/* Admin routes */}
          <Route element={<RoleBasedRoute allowedRoles={['admin']} />}>
            <Route path="/dashboard" element={<Admin1 />} />
            <Route path="/uploaded" element={<UploadedLCPage />} />
            <Route path="/assigned" element={<AssignedLCPage />} />
            <Route path="/completed" element={<CompletedLCPage />} />
            <Route path="/timeline" element={<LCTimelinePage />} />
            <Route path="/discrepencies/:lcNumber" element={<LCDetails />} />
          </Route>
          
          {/* Compliance Manager routes */}
          <Route element={<RoleBasedRoute allowedRoles={['complyce_manager']} />}>
            <Route path="/dashboardd" element={<ManagerDashboard />} />
            <Route path="/complete" element={<CompletedLCs />} />
            <Route path="/discrepency/:lcNumber" element={<Discrepancy />} />
          </Route>
          
          {/* SWIFT User routes */}
          <Route element={<RoleBasedRoute allowedRoles={['swift']} />}>
            <Route path="/swift-upload" element={<SwiftUploadPanel />} />
          </Route>
          
          {/* Support User routes */}
          <Route element={<RoleBasedRoute allowedRoles={['support']} />}>
            <Route path="/supporting-docs" element={<LCSupportingDocsUploader />} />
          </Route>
          {/* IT manager User routes */}
          <Route element={<RoleBasedRoute allowedRoles={['it_admin']} />}>
            <Route path="/users" element={<UserManagement />} />
            <Route path="/policies" element={<BankPolicyUploadPage />} />
            <Route path="/audit" element={<RequestAuditPage />} />
          </Route>
            {/* Super Admin User routes */}
          <Route element={<RoleBasedRoute allowedRoles={['super_admin']} />}>
            <Route path="/super" element={<SuperAdminAudits />} />
            <Route path="/userperformance" element={<UserPerformanceDashboard />} />
          </Route>
        </Route>
        
        {/* Unauthorized access page */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        
        {/* Catch all - redirect to login or dashboard based on auth status */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;