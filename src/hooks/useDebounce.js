/**
 * Custom hook for debouncing values
 * Hook personalizado para debounce de valores
 * 
 * @param {any} value - The value to debounce / Valor para aplicar debounce
 * @param {number} delay - Delay in milliseconds / Delay em milissegundos
 * @returns {any} Debounced value / Valor com debounce aplicado
 */
import { useState, useEffect } from 'react';

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up debounce timer / Configurar timer do debounce
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup timer on value change or unmount / Limpar timer ao mudar valor ou desmontar
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};