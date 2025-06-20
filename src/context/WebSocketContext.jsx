import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const WebSocketContext = createContext();


// WebSocket connection function
const createWebSocketConnection = (token) => {
  if (!token) {
    console.error('No token provided for WebSocket connection');
    return null;
  }

  const socket = new WebSocket(`wss://192.168.18.152:50013/ws/notifications?token=${token}`);
  
  return socket;
};



export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // 'connecting', 'connected', 'disconnected', 'error'
  const [lastMessage, setLastMessage] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  
  const reconnectTimeoutRef = useRef(null);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000; // 3 seconds

  // Connect to WebSocket
  const connect = useCallback(() => {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      setConnectionStatus('error');
      return;
    }

    // Don't connect if already connected
    if (socket && socket.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    try {
      setConnectionStatus('connecting');
      const ws = createWebSocketConnection(token);
      
      if (!ws) {
        setConnectionStatus('error');
        return;
      }

      // Connection established
      ws.onopen = (event) => {
        console.log("WebSocket Connection Established", event);
        setSocket(ws);
        setIsConnected(true);
        setConnectionStatus('connected');
        setReconnectAttempts(0); // Reset reconnect attempts on successful connection
        
        // Send initial message if needed
        ws.send(JSON.stringify({ type: 'client_connected', message: 'Hello from client' }));
      };

      // Receive messages
      ws.onmessage = (event) => {
        console.log("WebSocket Message received:", event.data);
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          setLastMessage({ raw: event.data });
        }
      };

      // Connection closed
      ws.onclose = (event) => {
        console.log("WebSocket closed:", event.code, event.reason);
        setSocket(null);
        setIsConnected(false);
        setConnectionStatus('disconnected');
        
        // Attempt to reconnect if not a clean close and we haven't exceeded max attempts
        if (!event.wasClean && reconnectAttempts < maxReconnectAttempts) {
          console.log(`Attempting to reconnect... (${reconnectAttempts + 1}/${maxReconnectAttempts})`);
          setReconnectAttempts(prev => prev + 1);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectDelay);
        } else if (reconnectAttempts >= maxReconnectAttempts) {
          console.error('Max reconnection attempts reached');
          setConnectionStatus('error');
        }
      };

      // Connection error
      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setConnectionStatus('error');
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionStatus('error');
    }
  }, [socket, reconnectAttempts]);

  // Disconnect WebSocket
  const disconnect = useCallback(() => {
    console.log('Manually disconnecting WebSocket');
    
    // Clear any pending reconnection attempts
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close(1000, 'Client initiated disconnect'); // Clean close
    }
    
    setSocket(null);
    setIsConnected(false);
    setConnectionStatus('disconnected');
    setReconnectAttempts(0);
  }, [socket]);

  // Send message
  const sendMessage = useCallback((message) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not connected, cannot send message:', message);
      return false;
    }

    try {
      const messageToSend = typeof message === 'string' ? message : JSON.stringify(message);
      socket.send(messageToSend);
      console.log('Message sent:', messageToSend);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }, [socket]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [socket]);

  const value = {
    socket,
    isConnected,
    connectionStatus,
    lastMessage,
    reconnectAttempts,
    connect,
    disconnect,
    sendMessage
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook to use WebSocket
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};



// Remove in future before github push

// // Alternative standalone hook (if you don't want to use context)
// export const useStandaloneWebSocket = () => {
//   const [socket, setSocket] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [connectionStatus, setConnectionStatus] = useState('disconnected');
//   const [lastMessage, setLastMessage] = useState(null);
  
//   const connect = useCallback(() => {
//     const token = localStorage.getItem('access_token');
    
//     if (!token) {
//       console.error('No access token found');
//       return;
//     }

//     if (socket && socket.readyState === WebSocket.OPEN) {
//       console.log('Already connected');
//       return;
//     }

//     try {
//       setConnectionStatus('connecting');
//       const ws = createWebSocketConnection(token);
      
//       ws.onopen = () => {
//         console.log("Standalone WebSocket connected");
//         setSocket(ws);
//         setIsConnected(true);
//         setConnectionStatus('connected');
//         ws.send(JSON.stringify({ type: 'client_connected', message: 'Hello from client' }));
//       };

//       ws.onmessage = (event) => {
//         console.log("Standalone WebSocket message:", event.data);
//         try {
//           const data = JSON.parse(event.data);
//           setLastMessage(data);
//         } catch (error) {
//           setLastMessage({ raw: event.data });
//         }
//       };

//       ws.onclose = () => {
//         console.log("Standalone WebSocket closed");
//         setSocket(null);
//         setIsConnected(false);
//         setConnectionStatus('disconnected');
//       };

//       ws.onerror = (error) => {
//         console.error("Standalone WebSocket error:", error);
//         setConnectionStatus('error');
//       };

//     } catch (error) {
//       console.error('Failed to create standalone WebSocket:', error);
//       setConnectionStatus('error');
//     }
//   }, [socket]);

//   const disconnect = useCallback(() => {
//     if (socket && socket.readyState === WebSocket.OPEN) {
//       socket.close();
//     }
//     setSocket(null);
//     setIsConnected(false);
//     setConnectionStatus('disconnected');
//   }, [socket]);

//   const sendMessage = useCallback((message) => {
//     if (!socket || socket.readyState !== WebSocket.OPEN) {
//       console.warn('Socket not connected');
//       return false;
//     }
    
//     try {
//       const messageToSend = typeof message === 'string' ? message : JSON.stringify(message);
//       socket.send(messageToSend);
//       return true;
//     } catch (error) {
//       console.error('Error sending message:', error);
//       return false;
//     }
//   }, [socket]);

//   // Cleanup
//   useEffect(() => {
//     return () => {
//       if (socket && socket.readyState === WebSocket.OPEN) {
//         socket.close();
//       }
//     };
//   }, [socket]);

//   return {
//     socket,
//     isConnected,
//     connectionStatus,
//     lastMessage,
//     connect,
//     disconnect,
//     sendMessage
//   };
// };