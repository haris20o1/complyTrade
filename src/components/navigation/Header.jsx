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
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  // const [userEmail, setUserEmail] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  // Get user role from AuthContext instead of localStorage
  const { userRole, isAuthenticated, socketConnection, userId, userInfo } = useAuth(); // ADD userId here

  const navigate = useNavigate(); // Add this line

  // Get WebSocket connection and messages
  const { lastMessage, isConnected: isWSConnected, connect: connectWS, connectionStatus, sendMessage } = useWebSocket();
  // Track if we've cleared notifications due to disconnection
  const [hasBeenConnected, setHasBeenConnected] = useState(false);

  // Initial dummy notification data - these will be replaced by real notifications
  const [notifications, setNotifications] = useState([]);


  const getUserEmail = () => {
    if (!userInfo) return 'Loading...';
    return userInfo.email || 'No email available';
  };

  const getUserName = () => {
    if (!userInfo) return null;
    return userInfo.fullname || userInfo.username || null;
  };

  const getUserDisplayName = () => {
    const name = getUserName();
    return name || getDisplayRole();
  };


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


  const handleNotificationClick = (notification) => {
    console.log('Notification clicked:', notification);

    // Send notification click data to backend
    if (isWSConnected && sendMessage) {
      const notificationClickData = {
        type: 'notification_clicked',
        notification_id: notification.originalId || notification.id,
        user_id: userId, // CHANGED: Use userId from AuthContext instead of userEmail
        timestamp: new Date().toISOString(),
        notification_type: notification.type
      };

      const messageSent = sendMessage(notificationClickData);

      if (messageSent) {
        console.log('Notification click data sent to backend:', notificationClickData);
      } else {
        console.error('Failed to send notification click data to backend');
      }
    } else {
      console.warn('WebSocket not connected, cannot send notification click data');
    }

    // Mark notification as read after sending click data
    markAsRead(notification.id);
    // Delete the notification from the UI
    deleteNotification(notification.id);

    // Hide the notification dropdown
    setShowNotifications(false);

    // Navigate based on notification title
    if (notification.title === 'lc_assigned') {
      navigate('/dashboardd');
    } else if (notification.title === 'lc_completed') {
      navigate('/completed');
    }
    // If title doesn't match any condition, no navigation occurs
  };

  // Get notification icon color based on type
  const getNotificationIconColor = (type) => {
    switch (type) {
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

    switch (userRole) {
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

    switch (userRole) {
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
    const userName = getUserName();

    // If we have a real name (fullname), use it for initials
    if (userName && userName !== userInfo?.username) {
      const nameParts = userName.trim().split(' ');
      if (nameParts.length > 1) {
        // First letter of first name + first letter of last name
        return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
      } else {
        // Just first letter of name
        return nameParts[0].charAt(0).toUpperCase();
      }
    }

    // If we only have username, use first letter of username
    if (userInfo?.username) {
      return userInfo.username.charAt(0).toUpperCase();
    }

    // Fallback to role-based initials if no user data available
    const displayRole = getDisplayRole();
    if (displayRole === 'Loading...') return '?';

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
            className={`relative p-2 rounded-full transition-colors ${isWSConnected
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
            <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${isWSConnected ? 'bg-green-500' : 'bg-red-500'
              }`} />
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                  <div className={`flex items-center space-x-1 text-xs px-2 py-1 rounded-full ${isWSConnected
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                    }`}>
                    <div className={`h-2 w-2 rounded-full ${isWSConnected ? 'bg-green-500' : 'bg-red-500'
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
                          className={`p-4 border-b border-gray-100 transition-colors hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''
                            }`}
                          onClick={() => handleNotificationClick(notification)}
                        >

                          <div className="flex items-start space-x-3">
                            <div className={`flex-shrink-0 ${getNotificationIconColor(notification.type)}`}>
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'
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
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        markAsRead(notification.id);
                                      }}
                                      className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                                      title="Mark as read"
                                    >
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                    </button>
                                  )}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteNotification(notification.id);
                                    }}
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
            {/* Show real name or fallback to role */}
            <div className="text-sm font-medium text-gray-800">
              {getUserDisplayName()}
            </div>
            {/* Show real email */}
            <div className="text-xs text-gray-500">
              {getUserEmail()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;


// import React, { useState, useEffect, useRef } from 'react';
// import { Search, Bell, CheckCircle, X, Clock, Settings, User, LogOut, ChevronDown } from 'lucide-react';
// import { useAuth } from '../../context/AuthContext'; // Import the auth context
// import { useWebSocket } from '../../context/WebSocketContext'; // Import the WebSocket context
// import { useNavigate } from 'react-router-dom';

// const Header = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   // const [userEmail, setUserEmail] = useState('');
//   const [showNotifications, setShowNotifications] = useState(false);
//   const notificationRef = useRef(null);

//   // Get user role from AuthContext instead of localStorage
//   const { userRole, isAuthenticated, socketConnection, userId, userInfo } = useAuth(); // ADD userId here

//   const navigate = useNavigate(); // Add this line

//   // Get WebSocket connection and messages
//   const { lastMessage, isConnected: isWSConnected, connect: connectWS, connectionStatus, sendMessage } = useWebSocket();
//   // Track if we've cleared notifications due to disconnection
//   const [hasBeenConnected, setHasBeenConnected] = useState(false);

//   // Initial dummy notification data - these will be replaced by real notifications
//   const [notifications, setNotifications] = useState([]);
//    const [showUserMenu, setShowUserMenu] = useState(false);


//   const getUserEmail = () => {
//     if (!userInfo) return 'Loading...';
//     return userInfo.email || 'No email available';
//   };

//   const getUserName = () => {
//     if (!userInfo) return null;
//     return userInfo.fullname || userInfo.username || null;
//   };

//   const getUserDisplayName = () => {
//     const name = getUserName();
//     return name || getDisplayRole();
//   };


//   // Function to convert WebSocket notification to our format
//   const convertWebSocketNotification = (wsNotification) => {
//     // Determine type based on notification_type or priority
//     let type = 'info';
//     let icon = Info;

//     if (wsNotification.notification_type === 'user_generated' || wsNotification.notification_type === 'User_Generated') {
//       type = 'success';
//       icon = CheckCircle;
//     } else if (wsNotification.priority > 0) {
//       type = 'alert';
//       icon = AlertTriangle;
//     }

//     // Format timestamp
//     const timestamp = new Date(wsNotification.timestamp);
//     const now = new Date();
//     const diffInMinutes = Math.floor((now - timestamp) / (1000 * 60));

//     let timeString;
//     if (diffInMinutes < 1) {
//       timeString = 'Just now';
//     } else if (diffInMinutes < 60) {
//       timeString = `${diffInMinutes} minutes ago`;
//     } else if (diffInMinutes < 1440) {
//       timeString = `${Math.floor(diffInMinutes / 60)} hours ago`;
//     } else {
//       timeString = `${Math.floor(diffInMinutes / 1440)} days ago`;
//     }

//     return {
//       id: `ws-${wsNotification.id}`,
//       type,
//       title: wsNotification.title,
//       message: wsNotification.content,
//       timestamp: timeString,
//       read: false,
//       icon,
//       isDummy: false,
//       priority: wsNotification.priority || 0,
//       originalId: wsNotification.id // Keep original ID to prevent duplicates
//     };
//   };

//   // Handle WebSocket connection status changes
//   useEffect(() => {
//     // Track if we've ever been connected
//     if (isWSConnected && connectionStatus === 'connected') {
//       setHasBeenConnected(true);
//     }

//     // Clear notifications only when we lose connection after being connected
//     if (hasBeenConnected && !isWSConnected && (connectionStatus === 'disconnected' || connectionStatus === 'error')) {
//       console.log('Header: Connection lost after being connected, clearing notifications');
//       setNotifications([]);
//       // Don't reset hasBeenConnected - we want to remember we were connected before
//     }
//   }, [isWSConnected, connectionStatus, hasBeenConnected]);

//   // Handle WebSocket messages - FIXED THIS PART
//   useEffect(() => {
//     if (lastMessage && isWSConnected) {
//       console.log('Header: Received WebSocket message:', lastMessage);

//       // Handle different message types
//       if (lastMessage.type === 'notification_batch' && lastMessage.notifications) {
//         // Convert WebSocket notifications to our format
//         const newNotifications = lastMessage.notifications.map(convertWebSocketNotification);

//         // Replace all notifications with new ones (avoid duplicates)
//         setNotifications(prevNotifications => {
//           // Get existing notification IDs to prevent duplicates
//           const existingIds = new Set(prevNotifications.map(n => n.originalId));

//           // Filter out notifications that already exist
//           const uniqueNewNotifications = newNotifications.filter(n => !existingIds.has(n.originalId));

//           // If this is a fresh batch (like after reconnection), replace all
//           if (prevNotifications.length === 0) {
//             console.log('Header: Setting fresh notifications batch');
//             return newNotifications;
//           }

//           // Otherwise, add only new unique notifications to the beginning
//           console.log('Header: Adding unique notifications:', uniqueNewNotifications.length);
//           return [...uniqueNewNotifications, ...prevNotifications];
//         });
//       } else if (lastMessage.type === 'single_notification') {
//         // Handle single notification
//         const newNotification = convertWebSocketNotification(lastMessage.notification);

//         setNotifications(prevNotifications => {
//           // Check if this notification already exists
//           const exists = prevNotifications.some(n => n.originalId === newNotification.originalId);

//           if (exists) {
//             console.log('Header: Duplicate notification ignored:', newNotification.originalId);
//             return prevNotifications;
//           }

//           console.log('Header: Adding new single notification');
//           return [newNotification, ...prevNotifications];
//         });
//       } else if (lastMessage.type === 'notification') {
//         // Handle the actual notification format you're receiving
//         console.log('Header: Processing notification type message');
//         const newNotification = convertWebSocketNotification(lastMessage);

//         setNotifications(prevNotifications => {
//           // Check if this notification already exists
//           const exists = prevNotifications.some(n => n.originalId === newNotification.originalId);

//           if (exists) {
//             console.log('Header: Duplicate notification ignored:', newNotification.originalId);
//             return prevNotifications;
//           }

//           console.log('Header: Adding new notification from WebSocket');
//           return [newNotification, ...prevNotifications];
//         });
//       }
//     }
//   }, [lastMessage, isWSConnected]);

//   // Connect to WebSocket when component mounts and user is authenticated
//   // Remove the connectionStatus dependency to prevent loops
//   useEffect(() => {
//     if (isAuthenticated && userRole && !isWSConnected) {
//       console.log('Header: Attempting to connect to WebSocket...');
//       connectWS();
//     }
//   }, [isAuthenticated, userRole, isWSConnected, connectWS]);

//   // Get unread notification count
//   const unreadCount = notifications.filter(notification => !notification.read).length;

//   // Close notification dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (notificationRef.current && !notificationRef.current.contains(event.target)) {
//         setShowNotifications(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);


//   // Mark notification as read
//   const markAsRead = (notificationId) => {
//     setNotifications(notifications.map(notification =>
//       notification.id === notificationId
//         ? { ...notification, read: true }
//         : notification
//     ));
//   };

//   // Mark all notifications as read
//   const markAllAsRead = () => {
//     setNotifications(notifications.map(notification => ({ ...notification, read: true })));
//   };

//   // Delete notification
//   const deleteNotification = (notificationId) => {
//     setNotifications(notifications.filter(notification => notification.id !== notificationId));
//   };


//   const handleNotificationClick = (notification) => {
//     console.log('Notification clicked:', notification);

//     // Send notification click data to backend
//     if (isWSConnected && sendMessage) {
//       const notificationClickData = {
//         type: 'notification_clicked',
//         notification_id: notification.originalId || notification.id,
//         user_id: userId, // CHANGED: Use userId from AuthContext instead of userEmail
//         timestamp: new Date().toISOString(),
//         notification_type: notification.type
//       };

//       const messageSent = sendMessage(notificationClickData);

//       if (messageSent) {
//         console.log('Notification click data sent to backend:', notificationClickData);
//       } else {
//         console.error('Failed to send notification click data to backend');
//       }
//     } else {
//       console.warn('WebSocket not connected, cannot send notification click data');
//     }

//     // Mark notification as read after sending click data
//     markAsRead(notification.id);
//     // Delete the notification from the UI
//     deleteNotification(notification.id);

//     // Hide the notification dropdown
//     setShowNotifications(false);

//     // Navigate based on notification title
//     if (notification.title === 'lc_assigned') {
//       navigate('/dashboardd');
//     } else if (notification.title === 'lc_completed') {
//       navigate('/completed');
//     }
//     // If title doesn't match any condition, no navigation occurs
//   };

//   // Get notification icon color based on type
//   const getNotificationIconColor = (type) => {
//     switch (type) {
//       case 'alert':
//         return 'text-red-500';
//       case 'success':
//         return 'text-green-500';
//       case 'info':
//         return 'text-blue-500';
//       default:
//         return 'text-gray-500';
//     }
//   };

//   // Format role for display (capitalize and handle special cases)
//   const getDisplayRole = () => {
//     if (!userRole) return 'Loading...';

//     switch (userRole) {
//       case 'complyce_manager':
//         return 'Compliance Manager';
//       case 'it_admin':
//         return 'IT Administrator';
//       case 'super_admin':
//         return 'Super Administrator';
//       case 'admin':
//         return 'Administrator';
//       case 'support':
//         return 'Support';
//       case 'swift':
//         return 'SWIFT User';
//       default:
//         return userRole.charAt(0).toUpperCase() + userRole.slice(1);
//     }
//   };

//   // Generate dashboard title based on role
//   const getDashboardTitle = () => {
//     if (!userRole) return 'Dashboard';

//     switch (userRole) {
//       case 'admin':
//         return 'Admin Dashboard';
//       case 'complyce_manager':
//         return 'Compliance Manager Dashboard';
//       case 'it_admin':
//         return 'IT Administrator Dashboard';
//       case 'super_admin':
//         return 'Super Admin Dashboard';
//       case 'support':
//         return 'Support Dashboard';
//       case 'swift':
//         return 'SWIFT Dashboard';
//       default:
//         return 'Dashboard';
//     }
//   };

//   // Generate avatar initials based on role
//   const getAvatarInitial = () => {
//     const userName = getUserName();

//     // If we have a real name (fullname), use it for initials
//     if (userName && userName !== userInfo?.username) {
//       const nameParts = userName.trim().split(' ');
//       if (nameParts.length > 1) {
//         // First letter of first name + first letter of last name
//         return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
//       } else {
//         // Just first letter of name
//         return nameParts[0].charAt(0).toUpperCase();
//       }
//     }

//     // If we only have username, use first letter of username
//     if (userInfo?.username) {
//       return userInfo.username.charAt(0).toUpperCase();
//     }

//     // Fallback to role-based initials if no user data available
//     const displayRole = getDisplayRole();
//     if (displayRole === 'Loading...') return '?';

//     if (displayRole.includes(' ')) {
//       return displayRole.split(' ').map(word => word.charAt(0)).join('');
//     }

//     return displayRole.charAt(0);
//   };


//   // Show loading state if not authenticated or no role yet
//   if (!isAuthenticated || !userRole) {
//     return (
//       <header className="h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between shadow-sm">
//         <div className="flex items-center">
//           <h1 className="text-2xl font-bold text-gray-800 tracking-wide">
//             Loading Dashboard...
//           </h1>
//         </div>

//         <div className="flex items-center space-x-2 md:space-x-4">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search..."
//               className="px-4 py-2 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               disabled
//             />
//             <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//           </div>

//           <button className="relative p-2 rounded-full hover:bg-gray-100" disabled>
//             <Bell className="h-6 w-6 text-gray-500" />
//           </button>

//          <div className="flex items-center space-x-2">
//   <div className="h-8 w-8 bg-gray-400 rounded-full flex items-center justify-center text-white">
//     ?
//   </div>
//   <div className="hidden md:block">
//     <div className="text-sm font-medium text-gray-800">Loading...</div>
//     <div className="text-xs text-gray-500">Please wait...</div>
//   </div>
// </div>
//         </div>
//       </header>
//     );
//   }

// return (
//     <header className="h-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 px-6 flex items-center justify-between shadow-lg backdrop-blur-sm">
//       {/* Left Section - Title */}
//       <div className="flex items-center">
//         <div className="flex items-center space-x-3">
//           <div className="w-2 h-8 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full"></div>
//           <h1 className="text-xl font-semibold text-white tracking-tight">
//             {getDashboardTitle()}
//           </h1>
//         </div>
//       </div>

//       {/* Right Section - Search, Notifications, User */}
//       <div className="flex items-center space-x-4">
//         {/* Enhanced Search Bar */}
//         <div className="relative group">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search documents, users..."
//               className="w-72 px-4 py-2.5 pl-11 bg-slate-800/80 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 backdrop-blur-sm"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//             <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
//           </div>
//         </div>

//         {/* Enhanced Notification Bell */}
//         <div className="relative" ref={notificationRef}>
//           <button
//             className={`relative p-2.5 rounded-lg transition-all duration-200 ${
//               isWSConnected
//                 ? 'bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/30'
//                 : 'bg-red-900/30 hover:bg-red-800/30 border border-red-500/50'
//             }`}
//             onClick={() => setShowNotifications(!showNotifications)}
//             title={isWSConnected ? 'Notifications' : 'WebSocket Disconnected - Click to view notifications'}
//           >
//             <Bell className={`h-5 w-5 ${isWSConnected ? 'text-slate-300' : 'text-red-400'}`} />
//             {unreadCount > 0 && (
//               <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs flex items-center justify-center font-medium shadow-lg">
//                 {unreadCount > 9 ? '9+' : unreadCount}
//               </span>
//             )}
//             {/* Enhanced WebSocket connection indicator */}
//             <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-900 shadow-sm ${
//               isWSConnected ? 'bg-green-400' : 'bg-red-400'
//             }`}>
//               {isWSConnected && (
//                 <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"></div>
//               )}
//             </div>
//           </button>

//           {/* Enhanced Notification Dropdown */}
//           {showNotifications && (
//             <div className="absolute right-0 mt-3 w-96 bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-2xl border border-slate-600/50 z-50 overflow-hidden">
//               {/* Header with gradient */}
//               <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 p-4 border-b border-slate-600/50">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-2">
//                     <h3 className="text-lg font-semibold text-white">Notifications</h3>
//                     <div className={`flex items-center space-x-1 text-xs px-2 py-1 rounded-full ${
//                       isWSConnected
//                         ? 'bg-green-500/20 text-green-300 border border-green-500/30'
//                         : 'bg-red-500/20 text-red-300 border border-red-500/30'
//                     }`}>
//                       <div className={`h-1.5 w-1.5 rounded-full ${isWSConnected ? 'bg-green-400' : 'bg-red-400'}`} />
//                       <span>{isWSConnected ? 'Live' : 'Offline'}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Notifications List */}
//               <div className="max-h-96 overflow-y-auto">
//                 {notifications.length === 0 ? (
//                   <div className="p-6 text-center text-slate-400">
//                     <Bell className="h-12 w-12 mx-auto mb-3 text-slate-600" />
//                     {isWSConnected ? (
//                       <p>No notifications</p>
//                     ) : (
//                       <div>
//                         <p className="text-red-400 font-medium">Connection Lost</p>
//                         <p className="text-sm mt-1">Notifications will appear when connection is restored</p>
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   notifications
//                     .sort((a, b) => {
//                       if (a.read !== b.read) return a.read - b.read;
//                       if (a.priority !== b.priority) return (b.priority || 0) - (a.priority || 0);
//                       return new Date(b.timestamp) - new Date(a.timestamp);
//                     })
//                     .map((notification) => {
//                       const IconComponent = notification.icon;
//                       return (
//                         <div
//                           key={notification.id}
//                           className={`p-4 border-b border-slate-700/50 transition-all duration-200 hover:bg-slate-700/30 cursor-pointer ${
//                             !notification.read ? 'bg-blue-500/10 border-l-4 border-l-blue-500' : ''
//                           }`}
//                           onClick={() => handleNotificationClick(notification)}
//                         >
//                           <div className="flex items-start space-x-3">
//                             <div className={`flex-shrink-0 ${getNotificationIconColor(notification.type)}`}>
//                               <IconComponent className="h-5 w-5" />
//                             </div>
//                             <div className="flex-1 min-w-0">
//                               <div className="flex items-start justify-between">
//                                 <div className="flex-1">
//                                   <p className={`text-sm font-medium ${
//                                     !notification.read ? 'text-white' : 'text-slate-300'
//                                   }`}>
//                                     {notification.title}
//                                   </p>
//                                   <p className="text-sm text-slate-400 mt-1">
//                                     {notification.message}
//                                   </p>
//                                   <div className="flex items-center mt-2 text-xs text-slate-500">
//                                     <Clock className="h-3 w-3 mr-1" />
//                                     {notification.timestamp}
//                                   </div>
//                                 </div>
//                                 <div className="flex items-center space-x-1 ml-2">
//                                   {!notification.read && (
//                                     <button
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         markAsRead(notification.id);
//                                       }}
//                                       className="p-1 rounded-full hover:bg-slate-600/50 transition-colors"
//                                       title="Mark as read"
//                                     >
//                                       <CheckCircle className="h-4 w-4 text-green-400" />
//                                     </button>
//                                   )}
//                                   <button
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       deleteNotification(notification.id);
//                                     }}
//                                     className="p-1 rounded-full hover:bg-slate-600/50 transition-colors"
//                                     title="Delete notification"
//                                   >
//                                     <X className="h-4 w-4 text-slate-400 hover:text-red-400" />
//                                   </button>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })
//                 )}
//               </div>

//               {/* Footer */}
//               {notifications.length > 0 && (
//                 <div className="p-3 bg-slate-700/30 border-t border-slate-600/50">
//                   <button className="w-full text-center text-sm text-blue-400 hover:text-blue-300 transition-colors py-1 font-medium">
//                     View all notifications
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Enhanced User Profile */}
//         <div className="relative" >
//           <button
//             className="flex items-center space-x-3 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/30 transition-all duration-200 group"
//             onClick={() => setShowUserMenu(!showUserMenu)}
//           >
//             <div className="flex items-center space-x-3">
//               <div className="relative">
//                 <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-lg">
//                   {getAvatarInitial()}
//                 </div>
//                 <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-400 rounded-full border-2 border-slate-900"></div>
//               </div>
//               <div className="hidden md:block text-left">
//                 <div className="text-sm font-medium text-white">
//                   {getUserDisplayName()}
//                 </div>
//                 <div className="text-xs text-slate-400">
//                   {getUserEmail()}
//                 </div>
//               </div>
//               <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
//             </div>
//           </button>

//           {/* User Dropdown Menu */}
//           {showUserMenu && (
//             <div className="absolute right-0 mt-3 w-56 bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-2xl border border-slate-600/50 z-50 overflow-hidden">
//               <div className="p-3 border-b border-slate-700/50 bg-gradient-to-r from-slate-700/50 to-slate-600/50">
//                 <div className="flex items-center space-x-3">
//                   <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
//                     {getAvatarInitial()}
//                   </div>
//                   <div>
//                     <div className="text-sm font-medium text-white">{getUserDisplayName()}</div>
//                     <div className="text-xs text-slate-400">{getUserEmail()}</div>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="py-2">
//                 <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors">
//                   <User className="h-4 w-4" />
//                   <span>Profile Settings</span>
//                 </button>
//                 <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors">
//                   <Settings className="h-4 w-4" />
//                   <span>Account Settings</span>
//                 </button>
//                 <hr className="my-2 border-slate-700/50" />
//                 <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">
//                   <LogOut className="h-4 w-4" />
//                   <span>Sign Out</span>
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };
// export default Header;