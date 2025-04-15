import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockClosedIcon, UserIcon, EnvelopeIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const SignupScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    fullname: '',
    password: '',
    confirmPassword: '',
    email: '',
    role: 'support' // Default role
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Prepare payload for API
      const payload = {
        username: formData.username,
        fullname: formData.fullname,
        password: formData.password,
        email: formData.email,
        role: formData.role
      };
      
      // Call registration API
      const response = await fetch('https://192.168.18.62:50013/users/user-registeration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
      }
      
      // Display success message
      setSuccess('Account created successfully! You can now login.');
      
      // Reset form
      setFormData({
        username: '',
        fullname: '',
        password: '',
        confirmPassword: '',
        email: '',
        role: 'support'
      });
      
      // Redirect to login after a delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchToLogin = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center">
      {/* Top nav bar */}
      <div className="fixed top-0 left-0 right-0 bg-gray-900 border-b border-gray-800 h-16 flex items-center px-6 z-10">
        <div className="flex items-center">
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
              <svg className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </div>
          
          {/* Main Card */}
          <div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden border border-gray-700">
            <div className="bg-blue-900 py-5 px-6 border-b border-gray-700">
              <div className="text-center">
                <h2 className="text-xl font-bold text-white tracking-wider">CREATE NEW ACCOUNT</h2>
                <div className="mt-1 h-px w-24 bg-blue-500 mx-auto"></div>
                <p className="text-blue-300 text-sm mt-1">LC Compliance System</p>
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

              {success && (
                <div className="mb-6 bg-green-900 bg-opacity-20 border-l-4 border-green-600 p-4 rounded">
                  <p className="text-green-400 text-sm flex items-center">
                    <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {success}
                  </p>
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
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
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="fullname" className="block text-sm font-medium text-gray-300">
                    Full Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserCircleIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                    </div>
                    <input
                      id="fullname"
                      name="fullname"
                      type="text"
                      required
                      className="pl-10 block w-full bg-gray-700 border-gray-600 text-white rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-10 border p-2"
                      placeholder="Enter your full name"
                      value={formData.fullname}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Email Address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="pl-10 block w-full bg-gray-700 border-gray-600 text-white rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-10 border p-2"
                      placeholder="Enter your email"
                      value={formData.email}
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
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
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

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                    Confirm Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      required
                      className="pl-10 block w-full bg-gray-700 border-gray-600 text-white rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-10 border p-2"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-300">
                    Account Type
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <select
                      id="role"
                      name="role"
                      required
                      className="block w-full bg-gray-700 border-gray-600 text-white rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-10 border p-2"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="support">support</option>
                      <option value="Admin">Admin</option>
                      <option value="swift">swift</option>

                    </select>
                  </div>
                </div>

                <div className="pt-2">
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
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6 flex items-center justify-center">
                <div className="text-sm">
                  <span className="text-gray-400">Already have an account?</span>{' '}
                  <button 
                    onClick={switchToLogin}
                    className="font-medium text-blue-400 hover:text-blue-300 ml-1"
                  >
                    Sign in
                  </button>
                </div>
              </div>

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
        </div>
      </div>
    </div>
  );
};

export default SignupScreen;