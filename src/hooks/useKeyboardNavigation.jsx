/**
 * Custom hook for keyboard navigation
 * Hook personalizado para navegação por teclado
 * 
 * @param {Array} items - List of items to navigate / Lista de itens para navegar
 * @param {Function} onSelect - Callback when item is selected / Callback quando item é selecionado
 * @returns {Object} Selected index and navigation state / Índice selecionado e estado da navegação
 */
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const useKeyboardNavigation = (items, onSelect) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    // Handle keyboard events / Gerenciar eventos de teclado
    const handleKeyDown = (e) => {
      // Ignore if typing in input / Ignorar se estiver digitando em input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      switch(e.key) {
        // Navigate down / Navegar para baixo
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < items.length - 1 ? prev + 1 : prev
          );
          break;
        
        // Navigate up / Navegar para cima
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        
        // Select current item / Selecionar item atual
        case 'Enter':
          if (selectedIndex >= 0 && items[selectedIndex]) {
            onSelect(items[selectedIndex]);
          }
          break;
        
        // Focus comment input / Focar no campo de comentário
        case 'c':
          document.querySelector('.comment-input')?.focus();
          break;
        
        // Focus search input / Focar na busca
        case '/':
          e.preventDefault();
          document.querySelector('.search-input')?.focus();
          break;
        
        // Show help / Mostrar ajuda
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
        
        // Close modals / Fechar modais
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