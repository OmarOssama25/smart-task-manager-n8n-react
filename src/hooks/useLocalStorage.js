import { useState, useEffect } from 'react';

/**
 * Custom hook for managing state synchronized with localStorage
 * 
 * This hook provides:
 * - Automatic persistence to localStorage
 * - Initial state loading from localStorage
 * - Fallback to default value if no stored value exists
 * 
 * @param {string} key - The localStorage key
 * @param {any} defaultValue - Default value if no stored value exists
 * @returns {[any, Function]} - Current value and setter function
 */
export function useLocalStorage(key, defaultValue) {
  // Initialize state with value from localStorage or default value
  const [value, setValue] = useState(() => {
    try {
      const storedValue = window.localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  // Update localStorage whenever value changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving localStorage key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue];
}

