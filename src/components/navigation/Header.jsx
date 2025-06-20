// import React, { useState, useEffect } from 'react';
// import { Bell, Search } from 'lucide-react';

// const Header = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [userRole, setUserRole] = useState('');
//   const [userEmail, setUserEmail] = useState('');
  
//   useEffect(() => {
//     // Get user role from localStorage that was set during login
//     const role = localStorage.getItem('user_role');
//     setUserRole(role || '');
    
//     // Set email based on role
//     if (role === 'admin') {
//       setUserEmail('admin@lcompliance.com');
//     } else if (role === 'complyce_manager') {
//       setUserEmail('manager@lcompliance.com');
//     } else if (role === 'it_admin') {
//       setUserEmail('ITmanager@lcompliance.com');
//     } else if (role === 'super_admin') {
//       setUserEmail('superadmin@lcompliance.com');
//     }
//   }, []);

//   // Format role for display (capitalize and handle complyce_manager)
//   const getDisplayRole = () => {
//     if (!userRole) return '';
//     if (userRole === 'complyce_manager') return 'Compliance Manager';
//     return userRole.charAt(0).toUpperCase() + userRole.slice(1);
    
//   };

//   // Generate avatar initials based on role
//   const getAvatarInitial = () => {
//     return getDisplayRole().charAt(0);
//   };

//   return (
//     <header className="h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between shadow-sm">
//       <div className="flex items-center">
//         <h1 className="text-2xl font-bold text-gray-800 tracking-wide">
//           {userRole === 'admin' ? 'Admin Dashboard' : userRole === 'complyce_manager' ? 'Compliance Manager Dashboard' :userRole === 'super_admin' ? 'Super Admin Dashboard' : 'IT Manager Dashboard'}
//         </h1>
//       </div>
      
//       <div className="flex items-center space-x-2 md:space-x-4">
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search..."
//             className="px-4 py-2 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//           <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//         </div>
        
//         <button className="relative p-2 rounded-full hover:bg-gray-100">
//           <Bell className="h-6 w-6 text-gray-500" />
//           <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
//             3
//           </span>
//         </button>
        
//         <div className="flex items-center space-x-2">
//           <div className="h-8 w-8 bg-indigo-500 rounded-full flex items-center justify-center text-white">
//             {getAvatarInitial()}
//           </div>
//           <div className="hidden md:block">
//             <div className="text-sm font-medium text-gray-800">{getDisplayRole()}</div>
//             <div className="text-xs text-gray-500">{userEmail}</div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
import React, { useState, useEffect, useRef } from 'react';
import { Bell, Search, X, Clock, User, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // Import the auth context
import { useWebSocket } from '../../context/WebSocketContext'; // Import the WebSocket context

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  
  // Get user role from AuthContext instead of localStorage
  const { userRole, isAuthenticated, socketConnection } = useAuth();
  
  // Get WebSocket connection and messages
  const { lastMessage, isConnected: isWSConnected, connect: connectWS, connectionStatus } = useWebSocket();

  // Track if we've cleared notifications due to disconnection
  const [hasBeenConnected, setHasBeenConnected] = useState(false);
  
  // Initial dummy notification data - these will be replaced by real notifications
  const [notifications, setNotifications] = useState([]);

  // Function to convert WebSocket notification to our format
  const convertWebSocketNotification = (wsNotification) => {
    // Determine type based on notification_type or priority
    let type = 'info';
    let icon = Info;
    
    if (wsNotification.notification_type === 'user_generated' || wsNotification.notification_type === 'User_Generated') {
      type = 'success';
      icon = CheckCircle;
    } else if (wsNotification.priority > 0) {
      type = 'alert';
      icon = AlertTriangle;
    }

    // Format timestamp
    const timestamp = new Date(wsNotification.timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - timestamp) / (1000 * 60));
    
    let timeString;
    if (diffInMinutes < 1) {
      timeString = 'Just now';
    } else if (diffInMinutes < 60) {
      timeString = `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      timeString = `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      timeString = `${Math.floor(diffInMinutes / 1440)} days ago`;
    }

    return {
      id: `ws-${wsNotification.id}`,
      type,
      title: wsNotification.title,
      message: wsNotification.content,
      timestamp: timeString,
      read: false,
      icon,
      isDummy: false,
      priority: wsNotification.priority || 0,
      originalId: wsNotification.id // Keep original ID to prevent duplicates
    };
  };

  // Handle WebSocket connection status changes
  useEffect(() => {
    // Track if we've ever been connected
    if (isWSConnected && connectionStatus === 'connected') {
      setHasBeenConnected(true);
    }
    
    // Clear notifications only when we lose connection after being connected
    if (hasBeenConnected && !isWSConnected && (connectionStatus === 'disconnected' || connectionStatus === 'error')) {
      console.log('Header: Connection lost after being connected, clearing notifications');
      setNotifications([]);
      // Don't reset hasBeenConnected - we want to remember we were connected before
    }
  }, [isWSConnected, connectionStatus, hasBeenConnected]);

  // Handle WebSocket messages - FIXED THIS PART
  useEffect(() => {
    if (lastMessage && isWSConnected) {
      console.log('Header: Received WebSocket message:', lastMessage);
      
      // Handle different message types
      if (lastMessage.type === 'notification_batch' && lastMessage.notifications) {
        // Convert WebSocket notifications to our format
        const newNotifications = lastMessage.notifications.map(convertWebSocketNotification);
        
        // Replace all notifications with new ones (avoid duplicates)
        setNotifications(prevNotifications => {
          // Get existing notification IDs to prevent duplicates
          const existingIds = new Set(prevNotifications.map(n => n.originalId));
          
          // Filter out notifications that already exist
          const uniqueNewNotifications = newNotifications.filter(n => !existingIds.has(n.originalId));
          
          // If this is a fresh batch (like after reconnection), replace all
          if (prevNotifications.length === 0) {
            console.log('Header: Setting fresh notifications batch');
            return newNotifications;
          }
          
          // Otherwise, add only new unique notifications to the beginning
          console.log('Header: Adding unique notifications:', uniqueNewNotifications.length);
          return [...uniqueNewNotifications, ...prevNotifications];
        });
      } else if (lastMessage.type === 'single_notification') {
        // Handle single notification
        const newNotification = convertWebSocketNotification(lastMessage.notification);
        
        setNotifications(prevNotifications => {
          // Check if this notification already exists
          const exists = prevNotifications.some(n => n.originalId === newNotification.originalId);
          
          if (exists) {
            console.log('Header: Duplicate notification ignored:', newNotification.originalId);
            return prevNotifications;
          }
          
          console.log('Header: Adding new single notification');
          return [newNotification, ...prevNotifications];
        });
      } else if (lastMessage.type === 'notification') {
        // Handle the actual notification format you're receiving
        console.log('Header: Processing notification type message');
        const newNotification = convertWebSocketNotification(lastMessage);
        
        setNotifications(prevNotifications => {
          // Check if this notification already exists
          const exists = prevNotifications.some(n => n.originalId === newNotification.originalId);
          
          if (exists) {
            console.log('Header: Duplicate notification ignored:', newNotification.originalId);
            return prevNotifications;
          }
          
          console.log('Header: Adding new notification from WebSocket');
          return [newNotification, ...prevNotifications];
        });
      }
    }
  }, [lastMessage, isWSConnected]);

  // Connect to WebSocket when component mounts and user is authenticated
  // Remove the connectionStatus dependency to prevent loops
  useEffect(() => {
    if (isAuthenticated && userRole && !isWSConnected) {
      console.log('Header: Attempting to connect to WebSocket...');
      connectWS();
    }
  }, [isAuthenticated, userRole, isWSConnected, connectWS]);

  // Get unread notification count
  const unreadCount = notifications.filter(notification => !notification.read).length;

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  useEffect(() => {
    console.log('Header: Current userRole from context:', userRole);
    
    // Set email based on role
    if (userRole === 'admin') {
      setUserEmail('admin@lcompliance.com');
    } else if (userRole === 'complyce_manager') {
      setUserEmail('manager@lcompliance.com');
    } else if (userRole === 'it_admin') {
      setUserEmail('ITmanager@lcompliance.com');
    } else if (userRole === 'super_admin') {
      setUserEmail('superadmin@lcompliance.com');
    } else if (userRole === 'support') {
      setUserEmail('support@lcompliance.com');
    } else if (userRole === 'swift') {
      setUserEmail('swift@lcompliance.com');
    } else {
      setUserEmail('user@lcompliance.com');
    }
  }, [userRole]); // Re-run when userRole changes

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true }
        : notification
    ));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  // Delete notification
  const deleteNotification = (notificationId) => {
    setNotifications(notifications.filter(notification => notification.id !== notificationId));
  };

  // Get notification icon color based on type
  const getNotificationIconColor = (type) => {
    switch(type) {
      case 'alert':
        return 'text-red-500';
      case 'success':
        return 'text-green-500';
      case 'info':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  // Format role for display (capitalize and handle special cases)
  const getDisplayRole = () => {
    if (!userRole) return 'Loading...';
    
    switch(userRole) {
      case 'complyce_manager':
        return 'Compliance Manager';
      case 'it_admin':
        return 'IT Administrator';
      case 'super_admin':
        return 'Super Administrator';
      case 'admin':
        return 'Administrator';
      case 'support':
        return 'Support';
      case 'swift':
        return 'SWIFT User';
      default:
        return userRole.charAt(0).toUpperCase() + userRole.slice(1);
    }
  };

  // Generate dashboard title based on role
  const getDashboardTitle = () => {
    if (!userRole) return 'Dashboard';
    
    switch(userRole) {
      case 'admin':
        return 'Admin Dashboard';
      case 'complyce_manager':
        return 'Compliance Manager Dashboard';
      case 'it_admin':
        return 'IT Administrator Dashboard';
      case 'super_admin':
        return 'Super Admin Dashboard';
      case 'support':
        return 'Support Dashboard';
      case 'swift':
        return 'SWIFT Dashboard';
      default:
        return 'Dashboard';
    }
  };

  // Generate avatar initials based on role
  const getAvatarInitial = () => {
    const displayRole = getDisplayRole();
    if (displayRole === 'Loading...') return '?';
    
    // For multi-word roles, get first letter of each word
    if (displayRole.includes(' ')) {
      return displayRole.split(' ').map(word => word.charAt(0)).join('');
    }
    
    return displayRole.charAt(0);
  };

  // Show loading state if not authenticated or no role yet
  if (!isAuthenticated || !userRole) {
    return (
      <header className="h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-800 tracking-wide">
            Loading Dashboard...
          </h1>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <button className="relative p-2 rounded-full hover:bg-gray-100" disabled>
            <Bell className="h-6 w-6 text-gray-500" />
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gray-400 rounded-full flex items-center justify-center text-white">
              ?
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-medium text-gray-800">Loading...</div>
              <div className="text-xs text-gray-500">Please wait...</div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-gray-800 tracking-wide">
          {getDashboardTitle()}
        </h1>
      </div>
      
      <div className="flex items-center space-x-2 md:space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        
        {/* Notification Bell with Dropdown */}
        <div className="relative" ref={notificationRef}>
          <button 
            className={`relative p-2 rounded-full transition-colors ${
              isWSConnected 
                ? 'hover:bg-gray-100' 
                : 'hover:bg-red-50 text-red-500'
            }`}
            onClick={() => setShowNotifications(!showNotifications)}
            title={isWSConnected ? 'Notifications' : 'WebSocket Disconnected - Click to view notifications'}
          >
            <Bell className={`h-6 w-6 ${isWSConnected ? 'text-gray-500' : 'text-red-500'}`} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
            {/* WebSocket connection indicator */}
            <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
              isWSConnected ? 'bg-green-500' : 'bg-red-500'
            }`} />
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                  <div className={`flex items-center space-x-1 text-xs px-2 py-1 rounded-full ${
                    isWSConnected 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    <div className={`h-2 w-2 rounded-full ${
                      isWSConnected ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span>{isWSConnected ? 'Live' : 'Offline'}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                 
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    {isWSConnected ? (
                      <p>No notifications</p>
                    ) : (
                      <div>
                        <p className="text-red-500 font-medium">Connection Lost</p>
                        <p className="text-sm mt-1">Notifications will appear when connection is restored</p>
                      </div>
                    )}
                  </div>
                ) : (
                  notifications
                    .sort((a, b) => {
                      // Sort by read status first (unread first), then by priority, then by timestamp
                      if (a.read !== b.read) return a.read - b.read;
                      if (a.priority !== b.priority) return (b.priority || 0) - (a.priority || 0);
                      return new Date(b.timestamp) - new Date(a.timestamp);
                    })
                    .map((notification) => {
                    const IconComponent = notification.icon;
                    return (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 transition-colors hover:bg-gray-50 ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`flex-shrink-0 ${getNotificationIconColor(notification.type)}`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className={`text-sm font-medium ${
                                  !notification.read ? 'text-gray-900' : 'text-gray-700'
                                }`}>
                                  {notification.title}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {notification.message}
                                </p>
                                <div className="flex items-center mt-2 text-xs text-gray-500">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {notification.timestamp}
                                </div>
                              </div>
                              <div className="flex items-center space-x-1 ml-2">
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                                    title="Mark as read"
                                  >
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteNotification(notification.id)}
                                  className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                                  title="Delete notification"
                                >
                                  <X className="h-4 w-4 text-gray-400" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-gray-200">
                  <button className="w-full text-center text-sm text-indigo-600 hover:text-indigo-800 transition-colors py-1">
                    View all notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {getAvatarInitial()}
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-medium text-gray-800">{getDisplayRole()}</div>
            <div className="text-xs text-gray-500">{userEmail}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;