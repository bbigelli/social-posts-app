import React, { createContext, useState, useEffect, useContext } from 'react';
import { USER_STORAGE_KEY } from '../utils/constants';
import toast from 'react-hot-toast';

// Create Auth Context
const AuthContext = createContext(null);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        console.log('AuthProvider: Loading user from localStorage');
        const savedUser = localStorage.getItem(USER_STORAGE_KEY);
        
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          console.log('AuthProvider: User loaded:', parsedUser);
          setUser(parsedUser);
        } else {
          console.log('AuthProvider: No user found');
        }
      } catch (error) {
        console.error('AuthProvider: Error loading user:', error);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    loadUser();
  }, []);

  // Sign in function
  const signIn = (username) => {
    console.log('AuthProvider: signIn called with:', username);
    
    if (!username || !username.trim()) {
      toast.error('Please enter a username');
      return false;
    }

    const trimmedUsername = username.trim();
    
    if (trimmedUsername.length < 3) {
      toast.error('Username must be at least 3 characters');
      return false;
    }

    if (trimmedUsername.length > 20) {
      toast.error('Username must be less than 20 characters');
      return false;
    }

    // Create user object
    const userData = { 
      username: trimmedUsername, 
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      loggedInAt: new Date().toISOString()
    };
    
    console.log('AuthProvider: Setting user data:', userData);
    
    // Update state FIRST
    setUser(userData);
    
    // Then save to localStorage
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      console.log('AuthProvider: User saved to localStorage');
    } catch (error) {
      console.error('AuthProvider: Error saving to localStorage:', error);
    }
    
    toast.success(`Welcome, ${username}!`);
    return true;
  };

  // Sign out function
  const signOut = () => {
    console.log('AuthProvider: signOut called');
    
    // Clear state FIRST
    setUser(null);
    
    // Then clear localStorage
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
      console.log('AuthProvider: User removed from localStorage');
    } catch (error) {
      console.error('AuthProvider: Error removing from localStorage:', error);
    }
    
    toast.success('Logged out successfully');
  };

  // Force refresh user state
  const refreshUser = () => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        console.log('AuthProvider: User refreshed:', parsedUser);
      }
    } catch (error) {
      console.error('AuthProvider: Error refreshing user:', error);
    }
  };

  const value = {
    user,
    isLoading,
    isInitialized,
    signIn,
    signOut,
    refreshUser,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};