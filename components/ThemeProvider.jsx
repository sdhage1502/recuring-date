
'use client';

import { useEffect } from 'react';
import { useThemeStore } from '../store/themeStore';

export default function ThemeProvider({ children }) {
  const { theme, getCurrentTheme } = useThemeStore();
  
  useEffect(() => {
    const currentTheme = getCurrentTheme();
    
    // Apply theme to CSS variables
    document.documentElement.style.setProperty('--primary-color', currentTheme.primary);
    document.documentElement.style.setProperty('--background-color', currentTheme.background);
    document.documentElement.style.setProperty('--surface-color', currentTheme.surface);
    document.documentElement.style.setProperty('--text-color', currentTheme.text);
    document.documentElement.style.setProperty('--text-secondary-color', currentTheme.textSecondary);
    
    // Apply theme class to body
    document.body.className = `theme-${theme} theme-transition`;
    document.body.style.backgroundColor = currentTheme.background;
    document.body.style.color = currentTheme.text;
  }, [theme, getCurrentTheme]);
  
  return <>{children}</>;
}
