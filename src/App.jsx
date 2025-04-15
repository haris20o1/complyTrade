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

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginScreen from "./components/auth/LoginScreen";
import SwiftUploadPanel from "./components/swift/SwiftUploadPanel";
import LCSupportingDocsUploader from "./components/documents/LCSupportingDocsUploader";
import SignupScreen from "./components/auth/SignupScreen";
import Admin1 from "./components/admin/admin1";
import UploadedLCPage from './components/admin/UploadedLCPage';
import AssignedLCPage from './components/admin/AssignedLCPage';
import CompletedLCPage from './components/admin/CompletedLCPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/signup" element={<SignupScreen />} />
        <Route path="/swift-upload" element={<SwiftUploadPanel />} />
        <Route path="/supporting-docs" element={<LCSupportingDocsUploader />} />
        <Route path="/dashboard" element={<Admin1 />} />
        <Route path="/uploaded" element={<UploadedLCPage />} />
        <Route path="/assigned" element={<AssignedLCPage />} />
        <Route path="/completed" element={<CompletedLCPage />} />

        {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
      </Routes>
    </Router>
  );
}

export default App;