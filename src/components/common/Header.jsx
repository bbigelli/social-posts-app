import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLogOut, FiUser, FiFilter, FiSun, FiMoon, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import SignUpModal from '../auth/SignUpModal';
import { SORT_OPTIONS } from '../../utils/constants';
import toast from 'react-hot-toast';

const Header = ({ onSortChange, currentSort, onlineStatus, unreadCount }) => {
  const { user, signOut, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    console.log('Header - User state:', user);
    console.log('Header - Is authenticated:', isAuthenticated);
  }, [user, isAuthenticated]);

  const handleSignOut = () => {
    signOut();
    setShowUserMenu(false);
    toast.success('See you soon!');
  };

  const handleSignInClick = () => {
    setShowSignUp(true);
  };

  const handleSignUpSuccess = () => {
    console.log('Header - Sign up successful');
    setShowSignUp(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
                       bg-clip-text text-transparent cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Social Posts
            </motion.h1>

            <div className="flex items-center gap-2">
              {onlineStatus !== undefined && (
                <div className="hidden sm:flex items-center gap-1 mr-2">
                  <div className={`w-2 h-2 rounded-full ${onlineStatus ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {onlineStatus ? 'Online' : 'Offline'}
                  </span>
                </div>
              )}

              {unreadCount > 0 && (
                <div className="relative mr-2">
                  <div className="absolute -top-1 -right-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                    <div className="w-2 h-2 bg-red-500 rounded-full absolute top-0 left-0" />
                  </div>
                </div>
              )}

              <div className="relative">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 
                           dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 
                           transition-colors flex items-center gap-2"
                  aria-label="Sort posts"
                >
                  <FiFilter className="w-5 h-5" />
                  <span className="hidden sm:inline">Sort</span>
                </motion.button>

                <AnimatePresence>
                  {showSortMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 
                               rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 
                               z-50 overflow-hidden"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            onSortChange(option.value);
                            setShowSortMenu(false);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-gray-100 
                                   dark:hover:bg-gray-700 transition-colors
                                   ${currentSort === option.value 
                                     ? 'text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20' 
                                     : 'text-gray-700 dark:text-gray-300'
                                   }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.1 }}
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 
                         dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 
                         transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
              </motion.button>

              {isAuthenticated && user ? (
                <div className="relative">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r 
                             from-blue-500 to-purple-600 text-white rounded-lg
                             hover:from-blue-600 hover:to-purple-700 transition-all
                             shadow-md hover:shadow-lg"
                  >
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                      <FiUser className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium max-w-[100px] truncate">
                      {user.username}
                    </span>
                    <FiChevronDown className={`w-4 h-4 transition-transform duration-200 
                                              ${showUserMenu ? 'rotate-180' : ''}`} />
                  </motion.button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 
                                 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 
                                 z-50 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Signed in as</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {user.username}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            ID: {user.id.slice(0, 8)}...
                          </p>
                        </div>
                        <button
                          onClick={handleSignOut}
                          className="w-full px-4 py-3 text-left flex items-center gap-3 
                                   hover:bg-gray-100 dark:hover:bg-gray-700
                                   text-red-600 dark:text-red-400 transition-colors"
                        >
                          <FiLogOut className="w-4 h-4" />
                          <span className="text-sm font-medium">Sign Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={handleSignInClick}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 
                           text-white rounded-lg font-medium
                           hover:from-blue-700 hover:to-purple-700 transition-all
                           shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <FiUser className="w-4 h-4" />
                  <span>Sign In</span>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </header>

      <SignUpModal 
        isOpen={showSignUp} 
        onClose={() => setShowSignUp(false)}
        onSuccess={handleSignUpSuccess}
      />
    </>
  );
};

export default Header;