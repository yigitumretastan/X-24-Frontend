import { useState, useEffect } from 'react';
import { getCookie } from '@/app/utils/cookies';

export type Theme = 'light' | 'dark';

interface UseThemeReturn {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export function useTheme(): UseThemeReturn {
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    const getThemeFromStorage = (): Theme => {
      // Önce localStorage'dan kontrol et
      if (typeof window !== 'undefined') {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark' || storedTheme === 'light') {
          return storedTheme as Theme;
        }
      }
      
      // Sonra cookie'den kontrol et
      const themeCookie = getCookie('theme');
      if (themeCookie === 'dark' || themeCookie === 'light') {
        return themeCookie as Theme;
      }
      
      // Default olarak light tema
      return 'light';
    };

    const initialTheme = getThemeFromStorage();
    setThemeState(initialTheme);
    
    // İlk yüklemede localStorage'a kaydet
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', initialTheme);
    }

    // Storage event listener (cross-tab theme changes)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme' && (e.newValue === 'light' || e.newValue === 'dark')) {
        setThemeState(e.newValue as Theme);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Body class'ını ve data-theme attribute'unu güncelle
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.body.classList.add('dark');
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.body.classList.remove('dark');
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    
    // LocalStorage'a kaydet
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
    
    // Cookie'ye de kaydet (backward compatibility)
    if (typeof document !== 'undefined') {
      document.cookie = `theme=${newTheme}; path=/; max-age=31536000`; // 1 yıl
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return {
    theme,
    toggleTheme,
    setTheme
  };
}
