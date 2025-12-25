'use client'; // If needed, but ThemeProvider is client-safe

import { ThemeProvider } from 'next-themes';

export default function ThemeProvider({ children }) {
  return (
    
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
     
  );
}