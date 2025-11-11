// src/redux/themeSlice.js

import { createSlice } from '@reduxjs/toolkit';

// Helper to get theme from localStorage, defaulting to 'light'
const getInitialTheme = () => {
  if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
    return localStorage.getItem('theme');
  }
  // Default to 'light' if no preference is found
  return 'light';
};

const initialState = {
  // Store the theme as a string: 'light' or 'dark'
  theme: getInitialTheme(), 
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    // Action to toggle the theme
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      // Persist the new theme to localStorage
      localStorage.setItem('theme', state.theme);
    },
    // Optional: for direct setting if needed
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', state.theme);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;