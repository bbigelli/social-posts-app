/**
 * Custom hook for authentication
 * Hook personalizado para autenticação
 * 
 * This is now a wrapper around AuthContext for backward compatibility
 */
import { useAuth as useAuthContext } from '../context/AuthContext';

export const useAuth = () => {
  return useAuthContext();
};