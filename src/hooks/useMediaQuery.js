/**
 * Custom hook for responsive media queries
 * Hook personalizado para media queries responsivas
 * 
 * @param {string} query - Media query string (e.g., '(max-width: 640px)')
 * @returns {boolean} Whether the media query matches / Se a media query corresponde
 */
import { useState, useEffect } from 'react';

export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Create media query list / Criar lista de media query
    const media = window.matchMedia(query);
    
    // Set initial value / Definir valor inicial
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    // Listener for changes / Listener para mudanças
    const listener = () => setMatches(media.matches);
    
    // Add listener / Adicionar listener
    window.addEventListener('resize', listener);
    
    // Cleanup / Limpeza
    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);

  return matches;
};