import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHeart, 
  FiMessageCircle, 
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import { formatDate } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';
import CommentSection from './CommentSection';
import toast from 'react-hot-toast';

const PostCard = ({ 
  post, 
  onEdit, 
  onDelete, 
  onLike, 
  isLiked,
  onAddComment,
  onDeleteComment,
  onUpdateComment,
  isAddingComment 
}) => {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [localLikes, setLocalLikes] = useState(post.likes || 0);
  const [isLikedLocal, setIsLikedLocal] = useState(isLiked);
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef(null);
  
  const isOwnPost = user?.id === post.userId?.toString();

  const handleDoubleClick = () => {
    if (!user) {
      toast.error('Please sign in to like posts');
      return;
    }
    
    setIsLikedLocal(!isLikedLocal);
    setLocalLikes(prev => isLikedLocal ? prev - 1 : prev + 1);
    onLike(post.id);
    
    toast.success('❤️ Liked!', { 
      icon: '❤️', 
      duration: 1000,
      style: {
        background: '#22c55e',
        color: 'white'
      }
    });
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(post);
    setShowMenu(false);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Delete button clicked for post:', post.id);
    onDelete(post.id);
    setShowMenu(false);
  };

  const handleCommentsClick = (e) => {
    e.stopPropagation();
    setShowComments(!showComments);
    setIsExpanded(!showComments);
    
    setTimeout(() => {
      if (cardRef.current) {
        cardRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          duration: 300
        });
      }
    }, 100);
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please sign in to like posts');
      return;
    }
    
    setIsLikedLocal(!isLikedLocal);
    setLocalLikes(prev => isLikedLocal ? prev - 1 : prev + 1);
    onLike(post.id);
  };

  const handleExpandClick = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    if (cardRef.current) {
      const event = new CustomEvent('post-expand', { 
        detail: { postId: post.id, expanded: showComments } 
      });
      window.dispatchEvent(event);
    }
  }, [showComments, post.id]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`post-card cursor-pointer relative overflow-visible mb-6 
                 ${isExpanded ? 'z-10 shadow-2xl' : 'z-0'}`}
      onDoubleClick={handleDoubleClick}
      style={{
        transform: isExpanded ? 'scale(1.02)' : 'scale(1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
      }}
    >
      <AnimatePresence>
        {isLikedLocal && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 2, opacity: 0.2 }}
            exit={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          >
            <FiHeart className="w-32 h-32 text-red-500 fill-current" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-start justify-between mb-4 relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 
                        flex items-center justify-center text-white font-bold text-lg
                        shadow-lg transform hover:scale-110 transition-transform duration-200">
            {post.userId?.toString().charAt(0).toUpperCase() || 'U'}
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              User {post.userId}
              {isOwnPost && (
                <span className="text-xs bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 
                               px-2 py-0.5 rounded-full">
                  You
                </span>
              )}
            </h3>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500 dark:text-gray-400">
                {formatDate(post.createdAt)}
              </span>
              {post.editedAt && (
                <>
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <span className="text-gray-400 dark:text-gray-500 italic">
                    edited
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExpandClick}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full 
                     transition-colors duration-200"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <FiChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <FiChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>

          {isOwnPost && (
            <div className="relative">
              <button
                onClick={handleMenuClick}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full 
                         transition-colors duration-200 focus:outline-none
                         focus:ring-2 focus:ring-blue-500"
                aria-label="Post options"
              >
                <FiMoreVertical className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>

              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 
                             rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 
                             z-30 overflow-hidden"
                  >
                    <button
                      onClick={handleEdit}
                      className="w-full px-4 py-3 text-left flex items-center gap-3 
                               hover:bg-gray-100 dark:hover:bg-gray-700
                               text-gray-700 dark:text-gray-300 transition-colors
                               border-b border-gray-100 dark:border-gray-700"
                    >
                      <FiEdit2 className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">Edit Post</span>
                    </button>
                    <button
                      onClick={handleDelete}
                      className="w-full px-4 py-3 text-left flex items-center gap-3 
                               hover:bg-gray-100 dark:hover:bg-gray-700
                               text-red-600 dark:text-red-400 transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      <span className="text-sm">Delete Post</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <div className="mb-4 relative z-20">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 
                     hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          {post.title}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {post.body}
        </p>
      </div>

      {post.media && (
        <div className="mb-4 rounded-lg overflow-hidden relative z-20">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
          )}
          <img 
            src={post.media} 
            alt="Post attachment"
            className={`w-full h-auto max-h-96 object-contain bg-gray-100 dark:bg-gray-800
                      ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onClick={(e) => {
              e.stopPropagation();
              window.open(post.media, '_blank');
            }}
          />
        </div>
      )}

      <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-700 relative z-20">
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          onClick={handleLikeClick}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200
                     ${isLikedLocal 
                       ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
                       : 'text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                     }`}
          aria-label="Like post"
        >
          <FiHeart className={`w-5 h-5 ${isLikedLocal ? 'fill-current animate-bounce' : ''}`} />
          <span className="text-sm font-medium">{localLikes}</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          onClick={handleCommentsClick}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200
                     ${showComments 
                       ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-300' 
                       : 'text-gray-500 dark:text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                     }`}
          aria-label="Show comments"
        >
          <FiMessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{post.comments?.length || 0}</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="mt-4 overflow-hidden relative z-20"
          >
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
              <CommentSection
                postId={post.id}
                comments={post.comments || []}
                currentUser={user}
                onAddComment={onAddComment}
                onDeleteComment={onDeleteComment}
                onUpdateComment={onUpdateComment}
                isAddingComment={isAddingComment}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!localStorage.getItem('double-click-hint-shown') && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.7, y: 0 }}
          className="absolute bottom-2 right-2 text-xs bg-gray-800 text-white 
                   px-2 py-1 rounded-full z-30"
        >
          Double-click to like ❤️
        </motion.div>
      )}
    </motion.div>
  );
};

export default PostCard;