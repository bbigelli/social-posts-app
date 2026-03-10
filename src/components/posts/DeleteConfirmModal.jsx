import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, isDeleting }) => {
  if (!isOpen) return null;

  const handleConfirm = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Delete confirm clicked'); // Debug log
    onConfirm();
  };

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-overlay"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="modal-content max-w-md"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <FiAlertTriangle className="w-6 h-6" />
              <h2 className="text-xl font-bold">Confirm Deletion</h2>
            </div>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              disabled={isDeleting}
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Are you sure you want to delete this post? This action cannot be undone.
          </p>

          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="btn-secondary flex-1"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isDeleting}
              className="btn-danger flex-1 flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                'Delete Post'
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DeleteConfirmModal;