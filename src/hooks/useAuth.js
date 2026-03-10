/**
 * Custom hook for authentication
 * Hook personalizado para autenticação
 */
import { useState, useEffect, useCallback } from 'react';
import { USER_STORAGE_KEY } from '../utils/constants';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount / Carregar usuário do localStorage ao montar
  useEffect(() => {
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // Sign in function / Função de login
  const signIn = useCallback((username) => {
    const userData = { username, id: Date.now().toString() };
    setUser(userData);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    toast.success(`Welcome, ${username}!`);
  }, []);

  // Sign out function / Função de logout
  const signOut = useCallback(() => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    toast.success('Logged out successfully');
  }, []);

  return { user, isLoading, signIn, signOut };
};