/**
 * Offline storage utility for saving posts when offline
 * Utilitário de armazenamento offline para salvar posts sem internet
 */
import toast from 'react-hot-toast';

// Simulate IndexedDB with localStorage for simplicity
const STORAGE_KEY = 'offline_posts';

export const offlineStorage = {
  /**
   * Save post to local storage
   * Salvar post no armazenamento local
   * 
   * @param {Object} post - Post data to save / Dados do post para salvar
   * @returns {Object} Saved post with offline ID / Post salvo com ID offline
   */
  async savePost(post) {
    try {
      // Get existing pending posts
      const pendingPosts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      
      // Create new post with offline metadata
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

  /**
   * Get all pending posts from storage
   * Buscar todos os posts pendentes do armazenamento
   * 
   * @returns {Array} List of pending posts / Lista de posts pendentes
   */
  async getPendingPosts() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (error) {
      console.error('Error fetching pending posts:', error);
      return [];
    }
  },

  /**
   * Sync pending posts with server
   * Sincronizar posts pendentes com o servidor
   * 
   * @param {Object} api - API service instance / Instância do serviço de API
   * @returns {Array} List of successfully synced posts / Lista de posts sincronizados com sucesso
   */
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
          // Remove offline fields before sending
          const { status, id: offlineId, ...postData } = post;
          const result = await api.createPost(postData);
          
          syncedPosts.push(result);
          
          // Remove from pending list after successful sync
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

  /**
   * Clear all pending posts
   * Limpar todos os posts pendentes
   */
  async clearPending() {
    localStorage.removeItem(STORAGE_KEY);
    toast.success('Offline posts cleared');
  }
};