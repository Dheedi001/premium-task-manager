import React, { createContext, useState, useEffect } from 'react';

// 1. Create the Context (This is the "bucket" that holds the data)
export const ThemeContext = createContext();

// 2. Create the Provider (This wraps around our app and gives access to the bucket)
export function ThemeProvider({ children }) {
  // We initialize the theme by checking localStorage first. If nothing is there, default to true (Dark Mode)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('ultra-theme-v7');
    return savedTheme !== null ? JSON.parse(savedTheme) : true;
  });

  // Whenever the theme changes, save it to localStorage
  useEffect(() => {
    localStorage.setItem('ultra-theme-v7', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // The function to toggle the theme
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}