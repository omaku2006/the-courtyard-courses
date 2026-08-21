import { createSlice } from '@reduxjs/toolkit';

export type ThemeMode = 'light' | 'light2' | 'dark' | 'dark2';

const VALID_MODES: ThemeMode[] = ['light', 'light2', 'dark', 'dark2'];

const getSavedTheme = (): ThemeMode => {
  const saved = localStorage.getItem('theme');
  if (saved && VALID_MODES.includes(saved as ThemeMode)) return saved as ThemeMode;
  return 'light';
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: getSavedTheme() } as { mode: ThemeMode },
  reducers: {
    cycleTheme: (state) => {
      const idx = VALID_MODES.indexOf(state.mode);
      state.mode = VALID_MODES[(idx + 1) % VALID_MODES.length];
      localStorage.setItem('theme', state.mode);
    },
    setTheme: (state, action: { payload: ThemeMode }) => {
      state.mode = action.payload;
      localStorage.setItem('theme', state.mode);
    },
  },
});

export const { cycleTheme, setTheme } = themeSlice.actions;
export const themeReducer = themeSlice.reducer;
