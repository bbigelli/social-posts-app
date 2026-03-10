/**
 * Custom hook for WebSocket real-time updates
 * Hook personalizado para atualizações em tempo real via WebSocket
 */
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

export const useWebSocket = (url) => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    // Simulate WebSocket connection (since it's frontend only)
    // Na vida real, seria: wsRef.current = new WebSocket(url);
    
    // Simulate connection
    setIsConnected(true);
    toast.success('🔌 Connected to real-time updates!');

    // Simulate receiving messages every 30 seconds
    const interval = setInterval(() => {
      const mockMessage = {
        id: Date.now(),
        user: `User ${Math.floor(Math.random() * 100)}`,
        title: `New post about ${['React', 'JavaScript', 'CSS', 'Node.js', 'TypeScript'][Math.floor(Math.random() * 5)]}`,
        timestamp: new Date().toISOString()
      };
      
      // Custom notification using JSX
      toast.custom((t) => (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl 
                      border-l-4 border-green-500 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-white font-bold">🆕</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {mockMessage.user} just posted!
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                {mockMessage.title}
              </p>
            </div>
          </div>
        </div>
      ));
      
      setMessages(prev => [mockMessage, ...prev]);
    }, 30000);

    // Cleanup on unmount
    return () => {
      clearInterval(interval);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url]);

  return { messages, isConnected };
};