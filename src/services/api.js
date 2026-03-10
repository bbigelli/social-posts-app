import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { generateId } from '../utils/helpers';

// Simulated backend service / Serviço de backend simulado
class ApiService {
  constructor() {
    this.posts = [];
    this.initializePosts();
  }

  async initializePosts() {
    // Fetch initial posts from JSONPlaceholder / Buscar posts iniciais do JSONPlaceholder
    try {
      const response = await axios.get(`${API_BASE_URL}/posts?_limit=10`);
      
      
      const englishTitles = [
        "My Journey with React",
        "Understanding JavaScript Closures",
        "Tips for Better CSS",
        "Why I Love TailwindCSS",
        "Getting Started with Node.js",
        "The Future of Web Development",
        "10 Tips for Clean Code",
        "How to Learn Programming",
        "My Favorite VS Code Extensions",
        "Building APIs with Express"
      ];

      const englishBodies = [
        "React has completely changed how I think about building user interfaces. The component-based architecture makes code reusable and maintainable...",
        "Closures are one of the most powerful features in JavaScript. They allow functions to access variables from an outer scope even after the outer function has returned...",
        "CSS can be tricky, but with the right approach it becomes much easier. Here are my top tips for writing clean and maintainable styles...",
        "TailwindCSS has revolutionized my workflow. Instead of writing custom CSS, I can build components directly in my markup using utility classes...",
        "Node.js allows us to run JavaScript on the server. It's perfect for building fast and scalable network applications...",
        "Web development is constantly evolving. From WebAssembly to AI integration, the future looks incredibly exciting...",
        "Clean code is not just about making it work. It's about making it readable, maintainable, and scalable for other developers...",
        "Learning to code can be overwhelming, but with the right strategy anyone can do it. Here's my step-by-step guide...",
        "VS Code has become the editor of choice for many developers. These extensions have made me significantly more productive...",
        "Express is a minimalist web framework for Node.js. It makes building REST APIs simple and intuitive..."
      ];

      this.posts = response.data.map((post, index) => ({
        id: post.id.toString(), // Ensure ID is string
        title: englishTitles[index % englishTitles.length],
        body: englishBodies[index % englishBodies.length],
        userId: post.userId.toString(), // Ensure userId is string
        createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        likes: Math.floor(Math.random() * 100),
        comments: Array(Math.floor(Math.random() * 3)).fill(null).map(() => ({
          id: generateId(),
          text: this.getRandomComment(),
          userId: Math.floor(Math.random() * 10) + 1,
          username: `User ${Math.floor(Math.random() * 10) + 1}`,
          createdAt: new Date(Date.now() - Math.random() * 1000000000).toISOString()
        })),
        media: Math.random() > 0.7 ? `https://picsum.photos/400/300?random=${post.id}` : null
      }));
      
      console.log('Initialized posts:', this.posts.length); // Debug log
    } catch (error) {
      console.error('Failed to initialize posts:', error);
    }
  }

  // Helper method to get random comments / Método auxiliar para comentários aleatórios
  getRandomComment() {
    const comments = [
      "Great post! Thanks for sharing.",
      "This is really helpful, keep it up!",
      "I learned something new today.",
      "Awesome content as always!",
      "Could you make a tutorial about this?",
      "This solved my problem, thank you!",
      "Best explanation I've seen so far.",
      "Looking forward to more content like this.",
      "Simple and clear, perfect!",
      "This deserves more likes!"
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  async getPosts() {
    // Simulate network delay / Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.posts;
  }

  async createPost(postData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newPost = {
      id: generateId(),
      ...postData,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: []
    };
    
    this.posts = [newPost, ...this.posts];
    console.log('Post created:', newPost); // Debug log
    return newPost;
  }

  async updatePost(id, updatedData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = this.posts.findIndex(post => post.id === id);
    if (index === -1) throw new Error('Post not found');
    
    this.posts[index] = { ...this.posts[index], ...updatedData };
    console.log('Post updated:', this.posts[index]); // Debug log
    return this.posts[index];
  }

  // DELETE POST METHOD
  async deletePost(id) {
    console.log('API deletePost called with ID:', id); // Debug log
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find the post index
    const index = this.posts.findIndex(post => post.id === id);
    console.log('Found post at index:', index); // Debug log
    
    if (index === -1) {
      console.error('Post not found with ID:', id);
      throw new Error('Post not found');
    }
    
    // Remove the post from the array
    const deletedPost = this.posts[index];
    this.posts.splice(index, 1);
    
    console.log('Post deleted successfully:', deletedPost); // Debug log
    console.log('Remaining posts:', this.posts.length); // Debug log
    
    return { success: true, deletedPost };
  }

  // Add comment to post / Adicionar comentário ao post
  async addComment(postId, commentData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = this.posts.findIndex(post => post.id === postId);
    if (index === -1) throw new Error('Post not found');
    
    const newComment = {
      id: generateId(),
      ...commentData,
      createdAt: new Date().toISOString()
    };
    
    if (!this.posts[index].comments) {
      this.posts[index].comments = [];
    }
    
    this.posts[index].comments.push(newComment);
    console.log('Comment added:', newComment); // Debug log
    return newComment;
  }

  // Delete comment from post / Deletar comentário do post
  async deleteComment(postId, commentId) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const postIndex = this.posts.findIndex(post => post.id === postId);
    if (postIndex === -1) throw new Error('Post not found');
    
    const commentIndex = this.posts[postIndex].comments.findIndex(c => c.id === commentId);
    if (commentIndex === -1) throw new Error('Comment not found');
    
    this.posts[postIndex].comments.splice(commentIndex, 1);
    console.log('Comment deleted:', commentId); // Debug log
    return { success: true };
  }

  // Update comment / Editar comentário
  async updateComment(postId, commentId, updatedText) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const postIndex = this.posts.findIndex(post => post.id === postId);
    if (postIndex === -1) throw new Error('Post not found');
    
    const commentIndex = this.posts[postIndex].comments.findIndex(c => c.id === commentId);
    if (commentIndex === -1) throw new Error('Comment not found');
    
    this.posts[postIndex].comments[commentIndex].text = updatedText;
    this.posts[postIndex].comments[commentIndex].editedAt = new Date().toISOString();
    
    console.log('Comment updated:', commentId); // Debug log
    return this.posts[postIndex].comments[commentIndex];
  }
}

export const api = new ApiService();