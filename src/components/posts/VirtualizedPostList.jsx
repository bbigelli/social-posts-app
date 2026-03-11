import React, { useRef, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import PostCard from './PostCard';

const VirtualizedPostList = ({ 
  posts, 
  onEdit, 
  onDelete, 
  onLike, 
  likedPosts,
  currentUser,
  onAddComment,
  onDeleteComment,
  onUpdateComment,
  isAddingComment,
  selectedIndex = -1,
  expandedComments = {}
}) => {
  const parentRef = useRef();

  const estimateSize = (index) => {
    const post = posts[index];
    let baseSize = 300;
    
    if (post?.media) {
      baseSize += 300;
    }
    
    if (expandedComments[post?.id]) {
      const commentCount = post?.comments?.length || 0;
      baseSize += 100;
      baseSize += commentCount * 70;
      baseSize += 60;
    }
    
    return baseSize;
  };

  const virtualizer = useVirtualizer({
    count: posts.length,
    getScrollElement: () => parentRef.current,
    estimateSize,
    overscan: 2,
  });

  useEffect(() => {
    if (selectedIndex >= 0 && virtualizer) {
      virtualizer.scrollToIndex(selectedIndex, { align: 'center' });
    }
  }, [selectedIndex, virtualizer]);

  useEffect(() => {
    virtualizer?.measure();
  }, [expandedComments, virtualizer]);

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No posts to display</p>
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className="w-full overflow-auto"
      style={{
        height: 'calc(100vh - 250px)',
        position: 'relative',
      }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const post = posts[virtualRow.index];
          const isSelected = virtualRow.index === selectedIndex;
          
          return (
            <div
              key={post.id}
              id={`post-${post.id}`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
                padding: '0 4px',
              }}
              className={`${isSelected ? 'ring-2 ring-blue-500 ring-opacity-50 rounded-lg' : ''}`}
            >
              <PostCard
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VirtualizedPostList;