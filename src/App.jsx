import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { useAuth } from './hooks/useAuth';
import { usePosts } from './hooks/usePosts';
import { useMediaQuery } from './hooks/useMediaQuery';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import { useWebSocket } from './hooks/useWebSocket';
import { offlineStorage } from './utils/offlineStorage';
import { api } from './services/api';

import Header from './components/common/Header';
import Container from './components/layout/Container';
import PostForm from './components/posts/PostForm';
import VirtualizedPostList from './components/posts/VirtualizedPostList';
import DeleteConfirmModal from './components/posts/DeleteConfirmModal';
import EditPostModal from './components/posts/EditPostModal';
import MentionInput from './components/common/MentionInput';
import LoadingSpinner from './components/common/LoadingSpinner';

import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5000,
    },
  },
});

function AppContent() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const isMobile = useMediaQuery('(max-width: 640px)');
  
  const [sortBy, setSortBy] = useState('newest');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showMentionInput, setShowMentionInput] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState(navigator.onLine);
  const [expandedComments, setExpandedComments] = useState({});
  
  useEffect(() => {
    console.log('App - User:', user);
    console.log('App - Is authenticated:', isAuthenticated);
  }, [user, isAuthenticated]);

  const {
    posts,
    isLoading: postsLoading,
    createPost,
    updatePost,
    deletePost,
    toggleLike,
    likedPosts,
    addComment,
    deleteComment,
    updateComment,
    isCreating,
    isUpdating,
    isDeleting,
    isAddingComment,
  } = usePosts(user, sortBy);

  useEffect(() => {
    const handlePostExpand = (event) => {
      const { postId, expanded } = event.detail;
      setExpandedComments(prev => ({
        ...prev,
        [postId]: expanded
      }));
    };

    window.addEventListener('post-expand', handlePostExpand);
    return () => window.removeEventListener('post-expand', handlePostExpand);
  }, []);

  const { selectedIndex } = useKeyboardNavigation(posts, (post) => {
    const element = document.getElementById(`post-${post.id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('ring-2', 'ring-blue-500', 'ring-opacity-50');
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-blue-500', 'ring-opacity-50');
      }, 2000);
    }
  });

  const { messages: realtimeMessages, isConnected } = useWebSocket('wss://demo.piesocket.com/v3/channel_1');

  useEffect(() => {
    const handleOnline = () => {
      setOnlineStatus(true);
      offlineStorage.syncPendingPosts(api).then(() => {
        queryClient.invalidateQueries(['posts']);
      });
    };
    
    const handleOffline = () => {
      setOnlineStatus(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('double-click-hint-shown')) {
      setTimeout(() => {
        localStorage.setItem('double-click-hint-shown', 'true');
      }, 10000);
    }
  }, []);

  const handleEdit = (post) => {
    setSelectedPost(post);
    setEditModalOpen(true);
  };

  const handleDelete = (postId) => {
    console.log('handleDelete called with postId:', postId);
    const postToDelete = posts.find(p => p.id === postId);
    console.log('Post to delete:', postToDelete);
    
    if (postToDelete) {
      setSelectedPost(postToDelete);
      setDeleteModalOpen(true);
    } else {
      console.error('Post not found with ID:', postId);
      toast.error('Post not found');
    }
  };

  const handleConfirmDelete = async () => {
    console.log('handleConfirmDelete called with selectedPost:', selectedPost);
    
    if (!selectedPost || !selectedPost.id) {
      console.error('No post selected for deletion');
      toast.error('No post selected');
      setDeleteModalOpen(false);
      setSelectedPost(null);
      return;
    }
    
    try {
      await deletePost(selectedPost.id);
      console.log('Delete successful, closing modal');
      setDeleteModalOpen(false);
      setSelectedPost(null);
    } catch (error) {
      console.error('Error in handleConfirmDelete:', error);
      toast.error('Failed to delete post');
    }
  };

  const handleConfirmEdit = async (updatedData) => {
    if (selectedPost) {
      await updatePost(selectedPost.id, updatedData);
      setEditModalOpen(false);
      setSelectedPost(null);
    }
  };

  const handleCreatePost = async (postData) => {
    if (!navigator.onLine) {
      await offlineStorage.savePost({
        ...postData,
        userId: user?.id,
        username: user?.username
      });
      toast.success('📱 Post saved offline! Will sync when online.');
    } else {
      createPost(postData);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="xl" color="blue" />
        <p className="mt-4 text-gray-600 dark:text-gray-400 animate-pulse">
          Loading your experience...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className={`fixed top-0 left-0 right-0 z-50 text-center text-xs py-1 
                    ${onlineStatus 
                      ? 'bg-green-500 text-white' 
                      : 'bg-yellow-500 text-black'}`}>
        {onlineStatus 
          ? isConnected 
            ? '🟢 Online - Real-time updates active' 
            : '🟢 Online'
          : '🔴 Offline - Posts saved locally'}
      </div>

      <Header 
        onSortChange={setSortBy} 
        currentSort={sortBy}
        onlineStatus={onlineStatus}
        unreadCount={realtimeMessages.length}
      />
      
      <Container>
        {!onlineStatus && (
          <div className="mb-4 p-4 bg-yellow-100 dark:bg-yellow-900/30 
                        border border-yellow-300 dark:border-yellow-700 rounded-lg">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm flex items-center gap-2">
              <span className="text-xl">📱</span>
              You're offline. Posts will be saved and synced when you're back online.
            </p>
          </div>
        )}

        {isAuthenticated && user && (
          <div className="mb-8">
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => setShowMentionInput(!showMentionInput)}
                className={`px-3 py-1 rounded-full text-sm transition-colors
                          ${showMentionInput 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
              >
                {showMentionInput ? 'Simple Post' : 'Post with @mentions'}
              </button>
            </div>
            
            {showMentionInput ? (
              <MentionInput onPost={handleCreatePost} />
            ) : (
              <PostForm 
                onSubmit={handleCreatePost}
                isSubmitting={isCreating}
              />
            )}
          </div>
        )}

        {postsLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" color="blue" />
          </div>
        ) : (
          <VirtualizedPostList
            posts={posts}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onLike={toggleLike}
            likedPosts={likedPosts}
            currentUser={user}
            onAddComment={addComment}
            onDeleteComment={deleteComment}
            onUpdateComment={updateComment}
            isAddingComment={isAddingComment}
            selectedIndex={selectedIndex}
            expandedComments={expandedComments}
          />
        )}

        {realtimeMessages.length > 0 && (
          <div className="fixed bottom-4 right-4 z-40">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 
                          border-l-4 border-green-500 max-w-xs">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Real-time activity
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {realtimeMessages[0].user}: {realtimeMessages[0].title}
              </p>
            </div>
          </div>
        )}
      </Container>

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          console.log('Closing delete modal');
          setDeleteModalOpen(false);
          setSelectedPost(null);
        }}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      <EditPostModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedPost(null);
        }}
        onConfirm={handleConfirmEdit}
        post={selectedPost}
        isUpdating={isUpdating}
      />

      <Toaster
        position={isMobile ? 'top-center' : 'bottom-right'}
        toastOptions={{
          duration: 3000,
          style: {
            background: document.documentElement.classList.contains('dark') 
              ? '#1f2937' 
              : '#ffffff',
            color: document.documentElement.classList.contains('dark')
              ? '#f3f4f6'
              : '#111827',
          },
        }}
      />

      <div className="fixed bottom-4 left-4 z-40">
        <button
          onClick={() => {
            toast.success(
              '⌨️ Keyboard Shortcuts:\n\n' +
              '↑/↓ - Navigate posts\n' +
              'Enter - Select post\n' +
              'C - Focus comment\n' +
              '/ - Search\n' +
              '? - Show this help\n' +
              'Esc - Close modal',
              { duration: 8000 }
            );
          }}
          className="bg-gray-800 dark:bg-gray-700 text-white p-3 rounded-full 
                   hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors
                   shadow-lg text-lg"
          title="Keyboard shortcuts"
        >
          ⌨️
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;