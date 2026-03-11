import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { useState, useMemo } from 'react';

export const usePosts = (currentUser, sortBy = 'newest') => {
  const queryClient = useQueryClient();
  const [likedPosts, setLikedPosts] = useState(new Set());

  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: () => api.getPosts(),
    staleTime: 10000,
  });

  const createPostMutation = useMutation({
    mutationFn: (data) => api.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
      toast.success('Post created successfully!');
    },
    onError: (error) => {
      console.error('Create post error:', error);
      toast.error('Failed to create post');
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: ({ id, data }) => api.updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
      toast.success('Post updated successfully!');
    },
    onError: (error) => {
      console.error('Update post error:', error);
      toast.error('Failed to update post');
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: (id) => {
      console.log('Deleting post with ID:', id);
      return api.deletePost(id);
    },
    onSuccess: (data, variables) => {
      console.log('Post deleted successfully:', variables);
      queryClient.invalidateQueries(['posts']);
      toast.success('Post deleted successfully!');
    },
    onError: (error, variables) => {
      console.error('Delete post error:', error, 'Post ID:', variables);
      toast.error('Failed to delete post');
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: ({ postId, text }) => api.addComment(postId, {
      text,
      userId: currentUser?.id,
      username: currentUser?.username
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
      toast.success('Comment added!');
    },
    onError: (error) => {
      console.error('Add comment error:', error);
      toast.error('Failed to add comment');
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: ({ postId, commentId }) => api.deleteComment(postId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
      toast.success('Comment deleted');
    },
    onError: (error) => {
      console.error('Delete comment error:', error);
      toast.error('Failed to delete comment');
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({ postId, commentId, text }) => api.updateComment(postId, commentId, text),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
      toast.success('Comment updated');
    },
    onError: (error) => {
      console.error('Update comment error:', error);
      toast.error('Failed to update comment');
    },
  });

  const toggleLike = (postId) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const createPost = (data) => {
    if (!currentUser) {
      toast.error('Please sign in to create a post');
      return;
    }
    createPostMutation.mutate({ ...data, userId: currentUser.id });
  };

  const updatePost = (id, data) => {
    if (!currentUser) {
      toast.error('Please sign in to update posts');
      return;
    }
    updatePostMutation.mutate({ id, data });
  };

  const deletePost = (id) => {
    console.log('Delete post called with ID:', id);
    
    if (!currentUser) {
      toast.error('Please sign in to delete posts');
      return;
    }
    
    if (!id) {
      console.error('No post ID provided for deletion');
      toast.error('Invalid post ID');
      return;
    }
    
    deletePostMutation.mutate(id);
  };

  const addComment = (postId, text) => {
    if (!currentUser) {
      toast.error('Please sign in to comment');
      return;
    }
    if (!text.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    addCommentMutation.mutate({ postId, text });
  };

  const deleteComment = (postId, commentId) => {
    if (!currentUser) {
      toast.error('Please sign in to delete comments');
      return;
    }
    deleteCommentMutation.mutate({ postId, commentId });
  };

  const updateComment = (postId, commentId, text) => {
    if (!currentUser) {
      toast.error('Please sign in to edit comments');
      return;
    }
    if (!text.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    updateCommentMutation.mutate({ postId, commentId, text });
  };

  const sortedAndFilteredPosts = useMemo(() => {
    let filtered = [...posts];
    
    switch (sortBy) {
      case 'newest':
        return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'oldest':
        return filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'mostLiked':
        return filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      case 'mostCommented':
        return filtered.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
      default:
        return filtered;
    }
  }, [posts, sortBy]);

  return {
    posts: sortedAndFilteredPosts,
    isLoading,
    error,
    createPost,
    updatePost,
    deletePost,
    toggleLike,
    likedPosts,
    addComment,
    deleteComment,
    updateComment,
    isCreating: createPostMutation.isPending,
    isUpdating: updatePostMutation.isPending,
    isDeleting: deletePostMutation.isPending,
    isAddingComment: addCommentMutation.isPending,
    isDeletingComment: deleteCommentMutation.isPending,
    isUpdatingComment: updateCommentMutation.isPending,
  };
};