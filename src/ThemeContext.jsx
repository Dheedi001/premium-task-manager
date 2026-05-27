import React, { createContext, useState, useEffect } from 'react';

// 1. Create the Context
export const ThemeContext = createContext();

// 2. Create the Provider
export function ThemeProvider({ children }) {
  // Initialize theme from localStorage, default to 'midnight' if empty
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('priority-theme-v9');
    return savedTheme || 'midnight';
  });

  // Persist theme choice whenever it changes
  useEffect(() => {
    localStorage.setItem('priority-theme-v9', theme);
  }, [theme]);

  // Updated function to handle multiple theme strings
  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
  };

  // Check if we are in a "dark" variant (for MUI and specific global styles)
  const isDarkMode = theme !== 'slate';

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}