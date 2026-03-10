import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiLogOut, FiUser, FiFilter } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from './ThemeToggle';
import SignUpModal from '../auth/SignUpModal';
import { SORT_OPTIONS } from '../../utils/constants';

const Header = ({ onSortChange, currentSort }) => {
  const { user, signOut } = useAuth();
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
                       bg-clip-text text-transparent"
            >
              Social Posts
            </motion.h1>

            <div className="flex items-center gap-2">
              {/* Sort Button */}
              <div className="relative">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 
                           dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 
                           transition-colors flex items-center gap-2"
                >
                  <FiFilter className="w-5 h-5" />
                  <span className="hidden sm:inline">Sort</span>
                </motion.button>

                {showSortMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 
                             rounded-lg shadow-xl border border-gray-200 dark:border-gray-700"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          onSortChange(option.value);
                          setShowSortMenu(false);
                        }}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-100 
                                 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg
                                 ${currentSort === option.value 
                                   ? 'text-blue-600 dark:text-blue-400 font-medium' 
                                   : 'text-gray-700 dark:text-gray-300'
                                 }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              <ThemeToggle />

              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 
                                dark:bg-blue-900/30 rounded-full">
                    <FiUser className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {user.username}
                    </span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={signOut}
                    className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 
                             text-gray-800 dark:text-gray-200 
                             hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    title="Sign Out"
                  >
                    <FiLogOut className="w-5 h-5" />
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSignUp(true)}
                  className="btn-primary"
                >
                  Sign In
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </header>

      <SignUpModal 
        isOpen={showSignUp} 
        onClose={() => setShowSignUp(false)} 
      />
    </>
  );
};

export default Header;