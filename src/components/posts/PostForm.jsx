import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiImage, FiX } from 'react-icons/fi';

const PostForm = ({ onSubmit, isSubmitting }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    await onSubmit({
      title: title.trim(),
      body: body.trim(),
      media: mediaPreview || null,
    });

    setTitle('');
    setBody('');
    setMedia(null);
    setMediaPreview(null);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="card mb-8"
    >
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Create New Post
      </h2>

      <div className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          className="input-field"
          disabled={isSubmitting}
        />

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What's on your mind?"
          rows="4"
          className="input-field resize-none"
          disabled={isSubmitting}
        />

        {/* Media attachment preview */}
        {mediaPreview && (
          <div className="relative inline-block">
            <img 
              src={mediaPreview} 
              alt="Preview" 
              className="h-20 w-20 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => {
                setMedia(null);
                setMediaPreview(null);
              }}
              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full 
                       hover:bg-red-600 transition-colors"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 
                          text-gray-700 dark:text-gray-300 rounded-lg cursor-pointer
                          hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <FiImage className="w-5 h-5" />
            <span>Add Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleMediaChange}
              className="hidden"
              disabled={isSubmitting}
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting || !title.trim() || !body.trim()}
            className="btn-primary flex-1"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Posting...</span>
              </div>
            ) : (
              'Create Post'
            )}
          </button>
        </div>
      </div>
    </motion.form>
  );
};

export default PostForm;