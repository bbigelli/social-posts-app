import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const useKeyboardNavigation = (items, onSelect) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      switch(e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < items.length - 1 ? prev + 1 : prev
          );
          break;
        
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        
        case 'Enter':
          if (selectedIndex >= 0 && items[selectedIndex]) {
            onSelect(items[selectedIndex]);
          }
          break;
        
        case 'c':
          document.querySelector('.comment-input')?.focus();
          break;
        
        case '/':
          e.preventDefault();
          document.querySelector('.search-input')?.focus();
          break;
        
        case '?':
          toast.custom((t) => (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border-l-4 border-blue-500">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">⌨️ Keyboard Shortcuts</h3>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li><span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">↑/↓</span> Navigate posts</li>
                <li><span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">Enter</span> Select post</li>
                <li><span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">C</span> Focus comment</li>
                <li><span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">/</span> Search</li>
                <li><span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">?</span> Show help</li>
                <li><span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">Esc</span> Close modal</li>
              </ul>
            </div>
          ), { duration: 5000 });
          break;
        
        case 'Escape':
          setSelectedIndex(-1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, selectedIndex, onSelect]);

  return { selectedIndex };
};