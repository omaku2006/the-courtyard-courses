import { createSlice } from '@reduxjs/toolkit';

type ThemeState = { mode: 'dark' | '' };

const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: '' } as ThemeState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'dark' ? '' : 'dark';
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export const themeReducer = themeSlice.reducer;
