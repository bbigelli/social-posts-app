import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUser, FiArrowRight, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const SignUpModal = ({ isOpen, onClose, onSuccess }) => {
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const trimmedUsername = username.trim();
    
    if (!trimmedUsername) {
      setError('Please enter a username');
      toast.error('Please enter a username');
      return;
    }

    if (trimmedUsername.length < 3) {
      setError('Username must be at least 3 characters');
      toast.error('Username must be at least 3 characters');
      return;
    }

    if (trimmedUsername.length > 20) {
      setError('Username must be less than 20 characters');
      toast.error('Username must be less than 20 characters');
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(trimmedUsername)) {
      setError('Username can only contain letters, numbers, and underscores');
      toast.error('Username can only contain letters, numbers, and underscores');
      return;
    }

    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      console.log('SignUpModal: Calling signIn with username:', trimmedUsername);
      
      const success = signIn(trimmedUsername);
      
      if (success) {
        console.log('SignUpModal: signIn successful');
        
        setUsername('');
        setError('');
        
        if (onSuccess) {
          onSuccess();
        }
        
        onClose();
      }
    } catch (error) {
      console.error('SignUpModal: Sign in error:', error);
      setError('Failed to sign in. Please try again.');
      toast.error('Failed to sign in');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setUsername('');
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]
                     flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full 
                       shadow-2xl border border-gray-200 dark:border-gray-700"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
                             bg-clip-text text-transparent">
                  Welcome! 👋
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Sign in to start posting and interacting
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 
                         rounded-full transition-colors"
                disabled={isSubmitting}
                type="button"
              >
                <FiX className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Choose your username
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                    text-gray-400 w-5 h-5" />
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setError('');
                    }}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl
                              bg-white dark:bg-gray-900 
                              text-gray-900 dark:text-white
                              focus:outline-none focus:ring-2 focus:ring-blue-500
                              transition-all duration-200
                              ${error 
                                ? 'border-red-300 dark:border-red-700 focus:ring-red-500' 
                                : 'border-gray-200 dark:border-gray-700'
                              }`}
                    placeholder="e.g., john_doe"
                    autoFocus
                    disabled={isSubmitting}
                  />
                </div>
                
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 dark:text-red-400 
                             flex items-center gap-1"
                  >
                    <FiAlertCircle className="w-4 h-4" />
                    {error}
                  </motion.p>
                )}

                <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                  ✨ 3-20 characters • letters, numbers, and underscores only
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 
                            border border-blue-100 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <span className="font-semibold">🎮 Demo Mode:</span> No real registration required. 
                  Any username works!
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 
                         text-white rounded-xl font-medium text-lg
                         hover:from-blue-700 hover:to-purple-700 
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transform hover:scale-[1.02] active:scale-[0.98]
                         transition-all duration-200 shadow-lg
                         flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent 
                                  rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Continue</span>
                    <FiArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="text-xs text-center text-gray-500 dark:text-gray-500">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SignUpModal;