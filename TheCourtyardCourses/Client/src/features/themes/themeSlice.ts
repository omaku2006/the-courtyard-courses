import { createSlice } from '@reduxjs/toolkit';

type ThemeState = { mode: 'dark' | '' };

const getSavedTheme = (): 'dark' | '' => {
  const saved = localStorage.getItem('theme');
  return (saved as 'dark' | '') || '';
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: getSavedTheme() } as ThemeState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'dark' ? '' : 'dark';
      localStorage.setItem('theme', state.mode);
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export const themeReducer = themeSlice.reducer;
