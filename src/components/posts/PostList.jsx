import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PostCard from './PostCard';
import { FiInbox } from 'react-icons/fi';

const PostList = ({ 
  posts, 
  isLoading, 
  onEdit, 
  onDelete, 
  onLike, 
  likedPosts,
  currentUser,
  onAddComment,
  onDeleteComment,
  onUpdateComment,
  isAddingComment
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent 
                      rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 dark:text-gray-400">Loading posts...</p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <FiInbox className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          No posts yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          {currentUser 
            ? 'Be the first to create a post!' 
            : 'Sign in to create your first post'}
        </p>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="popLayout">
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onEdit={onEdit}
            onDelete={onDelete}
            onLike={onLike}
            isLiked={likedPosts.has(post.id)}
            onAddComment={onAddComment}
            onDeleteComment={onDeleteComment}
            onUpdateComment={onUpdateComment}
            isAddingComment={isAddingComment}
          />
        ))}
      </div>
    </AnimatePresence>
  );
};

export default PostList;