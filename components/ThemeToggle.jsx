// components/ThemeToggle.jsx
'use client';

import { useState, useEffect } from 'react';
import { HiSun, HiMoon } from 'react-icons/hi';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(null); // null = loading
  const [isDark, setIsDark] = useState(false);

  // Initialize theme only once
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    let initial = saved || 'system';

    if (initial === 'system') {
      document.documentElement.classList.toggle('dark', prefersDark);
      setIsDark(prefersDark);
    } else {
      const shouldBeDark = initial === 'dark';
      document.documentElement.classList.toggle('dark', shouldBeDark);
      setIsDark(shouldBeDark);
    }

    setTheme(initial);
  }, []);

  const toggleTheme = () => {
    let nextTheme;

    if (theme === 'light') {
      nextTheme = 'dark';
    } else if (theme === 'dark') {
      nextTheme = 'system';
    } else {
      nextTheme = 'light';
    }

    setTheme(nextTheme);

    if (nextTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
      setIsDark(prefersDark);
      localStorage.removeItem('theme');
    } else {
      const shouldBeDark = nextTheme === 'dark';
      document.documentElement.classList.toggle('dark', shouldBeDark);
      setIsDark(shouldBeDark);
      localStorage.setItem('theme', nextTheme);
    }
  };

  // Prevent flash of wrong theme
  if (theme === null) return null;

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="
        relative p-2.5 rounded-full
        bg-[var(--color-surface)]/70 hover:bg-[var(--color-surface)]
        text-[var(--color-text-secondary)] hover:text-[var(--color-accent-500)]
        transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-accent-500/40
      "
    >
      <div className="relative w-6 h-6">
        <HiSun
          className={`absolute inset-0 w-6 h-6 transition-all duration-500 transform ${
            isDark ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'
          }`}
        />
        <HiMoon
          className={`absolute inset-0 w-6 h-6 transition-all duration-500 transform ${
            isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'
          }`}
        />
      </div>
    </button>
  );
}