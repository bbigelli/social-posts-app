import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const MentionInput = ({ onPost, placeholder = "Write something... @ to mention" }) => {
  const [content, setContent] = useState('');
  const [mentionSearch, setMentionSearch] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const inputRef = useRef();
  const mentionsRef = useRef();

  const mockUsers = [
    { id: 1, username: 'john_doe', avatar: 'J', fullName: 'John Doe' },
    { id: 2, username: 'jane_smith', avatar: 'J', fullName: 'Jane Smith' },
    { id: 3, username: 'bob_wilson', avatar: 'B', fullName: 'Bob Wilson' },
    { id: 4, username: 'alice_brown', avatar: 'A', fullName: 'Alice Brown' },
    { id: 5, username: 'charlie_davis', avatar: 'C', fullName: 'Charlie Davis' },
    { id: 6, username: 'emma_watson', avatar: 'E', fullName: 'Emma Watson' },
  ];

  const handleInput = (e) => {
    const value = e.target.value;
    const position = e.target.selectionStart;
    setContent(value);
    setCursorPosition(position);

    const textBeforeCursor = value.slice(0, position);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex !== -1 && !textBeforeCursor.slice(lastAtIndex).includes(' ')) {
      const search = textBeforeCursor.slice(lastAtIndex + 1);
      setMentionSearch(search);
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  };

  const insertMention = (user) => {
    const beforeMention = content.slice(0, cursorPosition);
    const afterMention = content.slice(cursorPosition);
    const lastAtIndex = beforeMention.lastIndexOf('@');
    const newContent = 
      beforeMention.slice(0, lastAtIndex) + 
      `@${user.username} ` + 
      afterMention;
    
    setContent(newContent);
    setShowMentions(false);
    inputRef.current.focus();
  };

  const handleSubmit = () => {
    if (!content.trim()) {
      toast.error('Please write something');
      return;
    }
    
    const mentions = content.match(/@(\w+)/g) || [];
    const mentionedUsers = mentions.map(m => m.slice(1));
    
    onPost({
      content,
      mentions: mentionedUsers,
      type: 'mention',
      timestamp: new Date().toISOString()
    });
    
    setContent('');
    toast.success('Posted with mentions!');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mentionsRef.current && !mentionsRef.current.contains(event.target)) {
        setShowMentions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredUsers = mockUsers.filter(u => 
    u.username.toLowerCase().includes(mentionSearch.toLowerCase()) ||
    u.fullName.toLowerCase().includes(mentionSearch.toLowerCase())
  );

  return (
    <div className="relative">
      <textarea
        ref={inputRef}
        value={content}
        onChange={handleInput}
        onClick={handleInput}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        className="input-field min-h-[120px] resize-none"
        placeholder={placeholder}
      />
      
      <AnimatePresence>
        {showMentions && filteredUsers.length > 0 && (
          <motion.div
            ref={mentionsRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full mb-2 w-72 bg-white dark:bg-gray-800 
                     rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 
                     max-h-60 overflow-y-auto z-50"
          >
            {filteredUsers.map(user => (
              <button
                key={user.id}
                onClick={() => insertMention(user)}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 
                         dark:hover:bg-gray-700 flex items-center gap-3
                         transition-colors duration-150 border-b 
                         border-gray-100 dark:border-gray-700 last:border-0"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 
                              flex items-center justify-center text-white font-bold text-sm
                              shadow-md">
                  {user.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.fullName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    @{user.username}
                  </p>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mt-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {content.length} characters
          </span>
          {content.includes('@') && (
            <span className="text-xs bg-blue-100 text-blue-600 dark:bg-blue-900 
                           dark:text-blue-300 px-2 py-0.5 rounded-full">
              ✨ Mentions enabled
            </span>
          )}
        </div>
        <button
          onClick={handleSubmit}
          disabled={!content.trim()}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 
                   text-white rounded-lg text-sm font-medium
                   hover:from-blue-700 hover:to-purple-700 
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transform hover:scale-105 transition-all duration-200
                   shadow-md hover:shadow-lg"
        >
          Post with Mentions
        </button>
      </div>
    </div>
  );
};

export default MentionInput;