import axios from 'axios';

// Create an Axios instance with default configs
export const axiosInstance = axios.create({
  baseURL: 'https://192.168.18.132:50013',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor - adds auth token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handles common errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 unauthorized (token expired)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('token_type');
      localStorage.removeItem('user_role');
      // Could redirect to login page here
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

// import axios from 'axios';

// // Create an Axios instance with performance optimizations for fast uploads
// export const axiosInstance = axios.create({
//   baseURL: 'https://192.168.18.132:50013',
//   timeout: 30000, // Default timeout
//   // Performance optimizations for parallel uploads
//   maxContentLength: Infinity,
//   maxBodyLength: Infinity,
//   // HTTP/2 and connection reuse optimizations
//   httpAgent: false, // Let browser handle connection pooling
//   httpsAgent: false,
//   // Compression and caching headers for better performance
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//     'Accept-Encoding': 'gzip, deflate, br',
//     'Connection': 'keep-alive',
//     'Cache-Control': 'no-cache'
//   }
// });

// // Refresh token function
// const refreshAccessToken = async () => {
//   try {
//     const refreshToken = localStorage.getItem('refresh_token');
    
//     const response = await axios.post('https://192.168.18.132:50013/authenticate/refresh-token', 
//       { refresh_token: refreshToken },
//       {
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       }
//     );
    
//     const { access_token, token_type } = response.data;
    
//     // Update the tokens in localStorage
//     localStorage.setItem('access_token', access_token);
//     localStorage.setItem('token_type', token_type);
    
//     return access_token;
//   } catch (error) {
//     // If refresh fails, force logout
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('token_type');
//     localStorage.removeItem('refresh_token');
//     window.location.href = '/';
//     return null;
//   }
// };

// // Track if token refresh is in progress
// let isRefreshing = false;
// // Store pending requests
// let failedQueue = [];

// // Process the queue of failed requests
// const processQueue = (error, token = null) => {
//   failedQueue.forEach(prom => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
  
//   failedQueue = [];
// };

// // Request interceptor - adds auth token and optimizes for uploads
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('access_token');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
    
//     // Optimize for file uploads and parallel requests
//     if (config.data instanceof FormData) {
//       // Remove content-type header to let browser set it with boundary
//       delete config.headers['Content-Type'];
      
//       // Disable request timeout for large file uploads
//       if (config.url?.includes('upload') || config.url?.includes('chunk')) {
//         config.timeout = 0; // No timeout for uploads
//       }
//     }
    
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor - handles common errors and token refresh
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
    
//     // Network error optimizations for parallel uploads
//     if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED') {
//       error.message = 'Network connection failed. Please check your internet connection.';
//       return Promise.reject(error);
//     }
    
//     // If the error is not 401 or request has already been retried, reject
//     if (error.response?.status !== 401 || originalRequest._retry) {
//       return Promise.reject(error);
//     }
    
//     // Set retry flag
//     originalRequest._retry = true;
    
//     if (!isRefreshing) {
//       isRefreshing = true;
      
//       try {
//         // Try to refresh the token
//         const newToken = await refreshAccessToken();
        
//         if (newToken) {
//           // Update header of original request
//           originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          
//           // Process all queued requests with new token
//           processQueue(null, newToken);
          
//           // Retry the original request
//           return axiosInstance(originalRequest);
//         }
//       } catch (refreshError) {
//         // Process failed queue
//         processQueue(refreshError, null);
        
//         // Logout user and redirect to login page
//         localStorage.removeItem('access_token');
//         localStorage.removeItem('token_type');
//         window.location.href = '/';
        
//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     } else {
//       // If refresh already in progress, add request to queue
//       return new Promise((resolve, reject) => {
//         failedQueue.push({ resolve, reject });
//       }).then(token => {
//         originalRequest.headers['Authorization'] = `Bearer ${token}`;
//         return axiosInstance(originalRequest);
//       }).catch(err => {
//         return Promise.reject(err);
//       });
//     }
    
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;