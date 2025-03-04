import React, { ReactNode } from 'react';
import { ThemeContext, useThemeProvider } from '../lib/theme';

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const themeContext = useThemeProvider();

  return (
    <ThemeContext.Provider value={themeContext}>
      {children}
    </ThemeContext.Provider>
  );
};