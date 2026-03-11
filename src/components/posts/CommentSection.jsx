import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiMoreVertical, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { formatDate } from '../../utils/helpers';

const CommentSection = ({ 
  postId, 
  comments = [], 
  currentUser,
  onAddComment,
  onDeleteComment,
  onUpdateComment,
  isAddingComment
}) => {
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const [showMenuFor, setShowMenuFor] = useState(null);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(postId, newComment);
    setNewComment('');
  };

  const handleEditSubmit = (commentId) => {
    if (!editText.trim()) return;
    onUpdateComment(postId, commentId, editText);
    setEditingComment(null);
    setEditText('');
  };

  const startEditing = (comment) => {
    setEditingComment(comment.id);
    setEditText(comment.text);
    setShowMenuFor(null);
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        Comments ({comments.length})
      </h4>

      <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2">
        <AnimatePresence>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 relative group"
            >
              {editingComment === comment.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="input-field text-sm"
                    rows="2"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditSubmit(comment.id)}
                      className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingComment(null)}
                      className="text-xs px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 
                                    flex items-center justify-center text-white text-xs font-bold">
                        {comment.username?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-900 dark:text-white">
                          {comment.username || `User ${comment.userId}`}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                    </div>

                    {currentUser?.id === comment.userId?.toString() && (
                      <div className="relative">
                        <button
                          onClick={() => setShowMenuFor(showMenuFor === comment.id ? null : comment.id)}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FiMoreVertical className="w-3 h-3 text-gray-500" />
                        </button>

                        {showMenuFor === comment.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 
                                     rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10"
                          >
                            <button
                              onClick={() => startEditing(comment)}
                              className="w-full px-3 py-2 text-left flex items-center gap-2 
                                       hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg
                                       text-xs text-gray-700 dark:text-gray-300"
                            >
                              <FiEdit2 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => {
                                onDeleteComment(postId, comment.id);
                                setShowMenuFor(null);
                              }}
                              className="w-full px-3 py-2 text-left flex items-center gap-2 
                                       hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg
                                       text-xs text-red-600 dark:text-red-400"
                            >
                              <FiTrash2 className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 ml-8">
                    {comment.text}
                  </p>
                  {comment.editedAt && (
                    <span className="text-xs text-gray-400 ml-8">(edited)</span>
                  )}
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {currentUser && (
        <form onSubmit={handleSubmitComment} className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="comment-input flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 
                     rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            disabled={isAddingComment}
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isAddingComment || !newComment.trim()}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors duration-200 flex items-center gap-1"
          >
            {isAddingComment ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiSend className="w-4 h-4" />
            )}
          </motion.button>
        </form>
      )}
    </div>
  );
};

export default CommentSection;