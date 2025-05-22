// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';
// import { loginUser } from '../authentication/auth';


// const LoginScreen = () => {
//   const navigate = useNavigate();
//   const [credentials, setCredentials] = useState({
//     username: '',
//     password: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [showPassword, setShowPassword] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setCredentials(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
    
//     try {
//       const data = await loginUser(credentials.username, credentials.password);
      
//       // Store token in localStorage or sessionStorage for future API calls
//       localStorage.setItem('access_token', data.access_token);
//       localStorage.setItem('token_type', data.token_type);
//       localStorage.setItem('user_role', data.role);
      
//       // Handle password_expired flag if needed
//       // if (data.password_expired) {
//       //   navigate('/change-password');
//       //   return;  
//       // }
      
//       // Redirect based on role
//       if (data.role === 'admin') {
//         navigate('/dashboard');
//       } else if (data.role === 'support') {
//         navigate('/supporting-docs');
//       } else if (data.role === 'swift') {
//         navigate('/swift-upload');
//       } else if (data.role === 'complyce_manager') {
//         navigate('/dashboardd');
//       } else if (data.role === 'it_admin') {
//         navigate('/users');
//       } else if (data.role === 'it_admin') {
//         navigate('/policies');
//       } else if (data.role === 'super_admin') {
//         navigate('/super');
//       } else {
//         // Handle unknown role
//         setError('Unknown user role. Please contact administrator.');
//       }
//     } catch (err) {
//       console.error('Login error:', err);
//       setError('Authentication failed. Please check your credentials and try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 flex flex-col justify-center">
//       {/* Top nav bar */}
//       <div className="fixed top-0 left-0 right-0 bg-gray-900 border-b border-gray-800 h-16 flex items-center px-6 z-10">
//         <div className="flex items-center">
//           {/* Use a simple div if the BuildingLibraryIcon isn't available */}
//           <div className="h-8 w-8 bg-blue-500 rounded flex items-center justify-center text-white">LC</div>
//           <span className="ml-3 text-white font-semibold tracking-wide">LC COMPLIANCE</span>
//         </div>
//         <div className="ml-auto text-gray-400 text-sm">
//           <span>Enterprise Banking Suite</span>
//         </div>
//       </div>
      
//       <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
//         <div className="w-full max-w-md">
//           {/* Security Badge */}
//           <div className="mb-6 flex justify-center">
//             <div className="bg-blue-900 bg-opacity-40 rounded-full p-3 border border-blue-700 shadow-lg">
//               {/* Fallback for ShieldCheckIcon */}
//               <svg className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-5.618 1.04M12 2.944a11.955 11.955 0 01-5.618 1.04l-1.5-1.5A11.955 11.955 0 0112 2.944m-9 9.5v9.5m9-9a9 9 0 0110 9m-9 .5h9a9.5 9.5 0 01-9 9" />
//               </svg>
//             </div>
//           </div>
          
//           {/* Main Card */}
//           <div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden border border-gray-700">
//             <div className="bg-blue-900 py-5 px-6 border-b border-gray-700">
//               <div className="text-center">
//                 <h2 className="text-xl font-bold text-white tracking-wider">LC COMPLIANCE SYSTEM</h2>
//                 <div className="mt-1 h-px w-24 bg-blue-500 mx-auto"></div>
//                 <p className="text-blue-300 text-sm mt-1">Secure Document Management</p>
//               </div>
//             </div>
            
//             <div className="p-8">
//               {error && (
//                 <div className="mb-6 bg-red-900 bg-opacity-20 border-l-4 border-red-600 p-4 rounded">
//                   <p className="text-red-400 text-sm flex items-center">
//                     <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                     </svg>
//                     {error}
//                   </p>
//                 </div>
//               )}

//               <form className="space-y-6" onSubmit={handleSubmit}>
//                 <div>
//                   <label htmlFor="username" className="block text-sm font-medium text-gray-300">
//                     Username
//                   </label>
//                   <div className="mt-1 relative rounded-md shadow-sm">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <UserIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
//                     </div>
//                     <input
//                       id="username"
//                       name="username"
//                       type="text"
//                       required
//                       className="pl-10 block w-full bg-gray-700 border-gray-600 text-white rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-10 border p-2"
//                       placeholder="Enter your username"
//                       value={credentials.username}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="password" className="block text-sm font-medium text-gray-300">
//                     Password
//                   </label>
//                   <div className="mt-1 relative rounded-md shadow-sm">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <LockClosedIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
//                     </div>
//                     <input
//                       id="password"
//                       name="password"
//                       type={showPassword ? "text" : "password"}
//                       required
//                       className="pl-10 block w-full bg-gray-700 border-gray-600 text-white rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-10 border p-2"
//                       placeholder="Enter your password"
//                       value={credentials.password}
//                       onChange={handleChange}
//                     />
//                     <button
//                       type="button"
//                       className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-400"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {/* Fallback for Eye icons */}
//                       {showPassword ? (
//                         <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//                         </svg>
//                       ) : (
//                         <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                         </svg>
//                       )}
//                     </button>
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center">
//                     <input
//                       id="remember-me"
//                       name="remember-me"
//                       type="checkbox"
//                       className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
//                     />
//                     <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
//                       Remember me
//                     </label>
//                   </div>

//                   <div className="text-sm">
//                     <a href="#" className="font-medium text-blue-400 hover:text-blue-300">
//                       Forgot password?
//                     </a>
//                   </div>
//                 </div>

//                 <div>
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
//                       loading ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
//                     } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800`}
//                   >
//                     {loading ? (
//                       <>
//                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         Signing in...
//                       </>
//                     ) : (
//                       'Secure Login'
//                     )}
//                   </button>
//                 </div>
//               </form>

//               <div className="mt-8 border-t border-gray-700 pt-6">
//                 <div className="flex items-center">
//                   <div className="bg-blue-900 bg-opacity-30 p-2 rounded">
//                     <svg className="h-4 w-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                     </svg>
//                   </div>
//                   <span className="ml-3 text-xs text-gray-400">
//                     This system complies with international banking standards and regulations
//                   </span>
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-gray-900 px-6 py-4 border-t border-gray-800">
//               <div className="flex flex-col items-center text-center">
//                 <p className="text-xs text-gray-500 mb-1">
//                   LC Compliance System © 2025. All rights reserved.
//                 </p>
//                 <div className="flex space-x-3 text-xs text-gray-600 mt-1">
//                   <span>Terms</span>
//                   <span>•</span>
//                   <span>Privacy</span>
//                   <span>•</span>
//                   <span>Security</span>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           {/* Session information */}
//           <div className="mt-6 text-center text-xs text-gray-500">
//             <p>Last login: 03/12/2025 09:45 AM • IP: 192.168.1.*** • <span className="text-blue-400">Report suspicious activity</span></p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';
import { loginUser } from '../authentication/auth';
import { useAuth } from '../../context/AuthContext';

const LoginScreen = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('Starting login process...');
      
      // Login user - this stores the token
      const authData = await loginUser(credentials.username, credentials.password);
      console.log('Login successful, token stored');
      
      // Check if password change is required
      // if (authData.password_expired || authData.requirePasswordChange) {
      //   navigate('/change-password');
      //   return;
      // }
      
      // CRITICAL FIX: Update the AuthContext state and get the role
      console.log('Updating auth context...');
      const userRole = await login();
      console.log('Role received from context update:', userRole);
      
      if (userRole) {
        console.log('Login successful, navigating based on role:', userRole);
        
        // CRITICAL FIX: Use a small delay to ensure state updates are processed
        // This prevents the AuthRedirectRoute from interfering
        setTimeout(() => {
          switch(userRole) {
            case 'admin':
              navigate('/dashboard', { replace: true });
              break;
            case 'support':
              navigate('/supporting-docs', { replace: true });
              break;
            case 'swift':
              navigate('/swift-upload', { replace: true });
              break;
            case 'complyce_manager':
              navigate('/dashboardd', { replace: true });
              break;
            case 'it_admin':
              navigate('/users', { replace: true });
              break;
            case 'super_admin':
              navigate('/super', { replace: true });
              break;
            default:
              console.log('Unknown role, redirecting to root');
              navigate('/', { replace: true });
          }
        }, 100); // Small delay to ensure state updates are processed
        
      } else {
        setError('Failed to retrieve user role. Please try again.');
        setLoading(false);
      }
      
    } catch (err) {
      console.error('Login error:', err);
      setError('Authentication failed. Please check your credentials and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center">
      {/* Top nav bar */}
      <div className="fixed top-0 left-0 right-0 bg-gray-900 border-b border-gray-800 h-16 flex items-center px-6 z-10">
        <div className="flex items-center">
          {/* Use a simple div if the BuildingLibraryIcon isn't available */}
          <div className="h-8 w-8 bg-blue-500 rounded flex items-center justify-center text-white">LC</div>
          <span className="ml-3 text-white font-semibold tracking-wide">LC COMPLIANCE</span>
        </div>
        <div className="ml-auto text-gray-400 text-sm">
          <span>Enterprise Banking Suite</span>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
        <div className="w-full max-w-md">
          {/* Security Badge */}
          <div className="mb-6 flex justify-center">
            <div className="bg-blue-900 bg-opacity-40 rounded-full p-3 border border-blue-700 shadow-lg">
              {/* Fallback for ShieldCheckIcon */}
              <svg className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-5.618 1.04M12 2.944a11.955 11.955 0 01-5.618 1.04l-1.5-1.5A11.955 11.955 0 0112 2.944m-9 9.5v9.5m9-9a9 9 0 0110 9m-9 .5h9a9.5 9.5 0 01-9 9" />
              </svg>
            </div>
          </div>
          
          {/* Main Card */}
          <div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden border border-gray-700">
            <div className="bg-blue-900 py-5 px-6 border-b border-gray-700">
              <div className="text-center">
                <h2 className="text-xl font-bold text-white tracking-wider">LC COMPLIANCE SYSTEM</h2>
                <div className="mt-1 h-px w-24 bg-blue-500 mx-auto"></div>
                <p className="text-blue-300 text-sm mt-1">Secure Document Management</p>
              </div>
            </div>
            
            <div className="p-8">
              {error && (
                <div className="mb-6 bg-red-900 bg-opacity-20 border-l-4 border-red-600 p-4 rounded">
                  <p className="text-red-400 text-sm flex items-center">
                    <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </p>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                    Username
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      className="pl-10 block w-full bg-gray-700 border-gray-600 text-white rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-10 border p-2"
                      placeholder="Enter your username"
                      value={credentials.username}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      className="pl-10 block w-full bg-gray-700 border-gray-600 text-white rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-10 border p-2"
                      placeholder="Enter your password"
                      value={credentials.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {/* Eye icons for password visibility */}
                      {showPassword ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-blue-400 hover:text-blue-300">
                      Forgot password?
                    </a>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      loading ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      'Secure Login'
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-8 border-t border-gray-700 pt-6">
                <div className="flex items-center">
                  <div className="bg-blue-900 bg-opacity-30 p-2 rounded">
                    <svg className="h-4 w-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="ml-3 text-xs text-gray-400">
                    This system complies with international banking standards and regulations
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 px-6 py-4 border-t border-gray-800">
              <div className="flex flex-col items-center text-center">
                <p className="text-xs text-gray-500 mb-1">
                  LC Compliance System © 2025. All rights reserved.
                </p>
                <div className="flex space-x-3 text-xs text-gray-600 mt-1">
                  <span>Terms</span>
                  <span>•</span>
                  <span>Privacy</span>
                  <span>•</span>
                  <span>Security</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Session information */}
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>Last login: 03/12/2025 09:45 AM • IP: 192.168.1.*** • <span className="text-blue-400">Report suspicious activity</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;