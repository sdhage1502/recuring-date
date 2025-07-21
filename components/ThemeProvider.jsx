
'use client';

import { useEffect } from 'react';
import { useThemeStore } from '../store/themeStore';

export default function ThemeProvider({ children }) {
  const { theme, getCurrentTheme } = useThemeStore();
  
  useEffect(() => {
    const currentTheme = getCurrentTheme();
    
    // Apply theme class to html element for dark mode
    const htmlElement = document.documentElement;
    
    // Remove existing theme classes
    htmlElement.classList.remove('light', 'dark', 'blue', 'green', 'purple');
    
    // Add current theme class
    htmlElement.classList.add(theme);
    
    // Apply CSS custom properties for dynamic theming
    const root = document.documentElement;
    root.style.setProperty('--primary-color', currentTheme.primary);
    root.style.setProperty('--background-color', currentTheme.background);
    root.style.setProperty('--surface-color', currentTheme.surface);
    root.style.setProperty('--text-color', currentTheme.text);
    root.style.setProperty('--text-secondary-color', currentTheme.textSecondary);
    
  }, [theme, getCurrentTheme]);
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      {children}
    </div>
  );
}
