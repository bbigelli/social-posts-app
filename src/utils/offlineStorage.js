import toast from 'react-hot-toast';

const STORAGE_KEY = 'offline_posts';

export const offlineStorage = {
  async savePost(post) {
    try {
      const pendingPosts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      
      const newPost = {
        ...post,
        id: `offline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      pendingPosts.push(newPost);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pendingPosts));
      
      if (!navigator.onLine) {
        toast.success('📱 Post saved offline! Will sync when back online.');
      }
      
      return newPost;
    } catch (error) {
      console.error('Error saving offline post:', error);
      toast.error('Failed to save post offline');
      throw error;
    }
  },

  async getPendingPosts() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (error) {
      console.error('Error fetching pending posts:', error);
      return [];
    }
  },

  async syncPendingPosts(api) {
    if (!navigator.onLine) {
      toast.error('No internet connection');
      return [];
    }

    try {
      const pendingPosts = await this.getPendingPosts();
      const syncedPosts = [];

      for (const post of pendingPosts) {
        try {
          const { status, id: offlineId, ...postData } = post;
          const result = await api.createPost(postData);
          
          syncedPosts.push(result);
          
          const updated = pendingPosts.filter(p => p.id !== post.id);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          
          toast.success(`✅ Post "${post.title}" synced!`);
        } catch (error) {
          console.error('Error syncing post:', post.id, error);
          toast.error(`Failed to sync "${post.title}"`);
        }
      }

      return syncedPosts;
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Failed to sync offline posts');
      return [];
    }
  },

  async clearPending() {
    localStorage.removeItem(STORAGE_KEY);
    toast.success('Offline posts cleared');
  }
};